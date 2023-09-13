import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {DEFAULT_REDIS_NAMESPACE, InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import {HttpService} from "@nestjs/axios";
import {SearchResultInterface} from "../../share/interfaces";
import {FetcherDto} from "./fetcher.dto";
import {ConfigService} from "@nestjs/config";
import {AxiosResponse} from "axios";
import {catchError, forkJoin, from, map, Observable, of, switchMap} from "rxjs";
import {YoutubeContentType} from "../../share/interfaces/search.interface";
import * as stream from "stream";
import * as ytdl from "ytdl-core"

@Injectable()
export class FetcherService {
    constructor(
        @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis:Redis,
        private readonly httpService:HttpService,
        private readonly configService:ConfigService
    ) {
    }
    searchKeyWord({keyWord , limit}:FetcherDto): Observable<SearchResultInterface[]> {
        keyWord = keyWord.replace(" " ,'+')
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${keyWord}&type=video,playlist&key=${this.configService.getOrThrow("YOUTUBE_API_KEY")}`;

        return this.httpService.get(searchUrl).pipe(
            switchMap(({ data: { items } }) => {
                if (!items.length) {
                    return of([]);
                }

                const videoItems = items.filter(({ id }) => id.kind === 'youtube#video');
                const playlistItems = items.filter(({ id }) => id.kind === 'youtube#playlist');

                return forkJoin({
                    videoDetails: this.getVideoDetails(videoItems),
                    playlistDetails: this.getPlaylistDetails(playlistItems),
                }).pipe(
                    map(({ videoDetails, playlistDetails }) => {
                        return [
                            ...videoDetails,
                            ...playlistDetails,
                        ];
                    }),
                    catchError(err => {
                        throw new InternalServerErrorException('Error fetching details', err);
                    }),
                );
            }),
            catchError(err => {
                console.log(err)
                throw new InternalServerErrorException('Error fetching search results', err);
            }),
        );
    }
    private processVideoItems = (videoItems: any[], videoDetails: any[]): SearchResultInterface[] => {
        return videoDetails.map(detail => {
            const item = videoItems.find(i => i.id.videoId === detail.id);

            if(item) {
                const link = `https://www.youtube.com/watch?v=${detail.id}`;
                const isoDuration = detail.contentDetails.duration;

                const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                const hours = (parseInt((match[1] || '0H').slice(0,-1)) || 0).toString().padStart(2, '0');
                const minutes = (parseInt((match[2] || '0M').slice(0,-1)) || 0).toString().padStart(2, '0');
                const seconds = (parseInt((match[3] || '0S').slice(0,-1)) || 0).toString().padStart(2, '0');

                const length = `${hours}:${minutes}:${seconds}`;

                return {
                    link: link,
                    name: item.snippet.title,
                    cover: item.snippet.thumbnails.default.url,
                    channel: item.snippet.channelTitle,
                    duration: length,
                    contentType:YoutubeContentType.Video
                };
            }
            return null;
        }).filter(i => i);
    };

    private processPlaylistItems = (playlistItems: any[], playlistDetails: any[]): SearchResultInterface[] => {
        return playlistItems.map(detail => {
            const item = playlistDetails.find(i => i.id === detail.id.playlistId);

            if(item) {
                const link = `https://www.youtube.com/playlist?list=${detail.id.playlistId}`;
                return {
                    link: link,
                    name: item.snippet.title,
                    cover: item.snippet.thumbnails.default.url,
                    channel: item.snippet.channelTitle,
                    contentType:YoutubeContentType.Playlist
                };
            }
            return null
        }).filter(i => i);
    };
    getVideoDetails(videoItems: any[]): Observable<any> {
        const videoIds = videoItems.map(({ id: { videoId }}) => videoId).join(",");
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${this.configService.getOrThrow("YOUTUBE_API_KEY")}`;

        return this.httpService.get(videoDetailsUrl).pipe(
            map(videoDetails => this.processVideoItems(videoItems, videoDetails.data.items)),
            catchError(err => {
                throw new InternalServerErrorException('Error fetching video details', err);
            }),
        );
    }

    getPlaylistDetails(playlistItems: any[]): Observable<any> {
        const playlistIds = playlistItems.map(({ id: { playlistId }}) => playlistId).join(",");
        const playlistDetailsUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistIds}&key=${this.configService.getOrThrow("YOUTUBE_API_KEY")}`;

        return this.httpService.get(playlistDetailsUrl).pipe(
            map(playlistDetails => this.processPlaylistItems(playlistItems, playlistDetails.data.items)),
            catchError(err => {
                throw new InternalServerErrorException('Error fetching playlist details', err);
            }),
        );
    }

    getVideoDetailsFromUrl(url: string): Observable<any> {
        let videoId = url.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }

        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${this.configService.getOrThrow("YOUTUBE_API_KEY")}`;

        return this.httpService.get(videoDetailsUrl).pipe(
            map(({data}) => {
                console.log(data)
                return data.items[0]
            }),
            catchError(err => {
                throw new InternalServerErrorException('Error fetching video details', err);
            }),
        );
    }
    getVideoBytes(url :string) : Observable<{stream : stream.Readable , info : ytdl.videoInfo}> {
        return from(ytdl.getInfo(url)).pipe(map(info => {
            const stream =  ytdl.downloadFromInfo(info, {
                filter: 'audioonly',
                quality:"highestaudio",
            });
            return {stream , info}
        }))
    }
}
