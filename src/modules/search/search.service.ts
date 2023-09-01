import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {DEFAULT_REDIS_NAMESPACE, InjectRedis} from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import {HttpService} from "@nestjs/axios";
import {SearchResultInterface} from "../../share/interfaces";
import {SearchDto} from "./search.dto";
import {ConfigService} from "@nestjs/config";
import {AxiosResponse} from "axios";
import {catchError, forkJoin, map, Observable, of, switchMap} from "rxjs";
import {YoutubeContentType} from "../../share/interfaces/search.interface";

@Injectable()
export class SearchService {
    constructor(
        @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis:Redis,
        private readonly httpService:HttpService,
        private readonly configService:ConfigService
    ) {
    }
    searchKeyWord({keyWord , limit}:SearchDto): Observable<SearchResultInterface[]> {
        keyWord = keyWord.replace(" " ,'+')
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${keyWord}&type=video,playlist&key=${this.configService.getOrThrow("YOUTUBE_API_KEY")}`;

        return this.httpService.get(searchUrl).pipe(
            switchMap(({ data: { items } }) => {
                if (!items.length) {
                    return of([]);
                }

                const videoItems = items.filter(({ id }) => id.kind === 'youtube#video');
                const videoIds = videoItems.map(({ id: { videoId }}) => videoId).join(",");

                const playlistItems = items.filter(({ id }) => id.kind === 'youtube#playlist');
                const playlistIds = playlistItems.map(({ id: { playlistId }}) => playlistId).join(",");

                const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${this.configService.getOrThrow("YOUTUBE_API_KEY")}`;
                const playlistDetailsUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistIds}&key=${this.configService.getOrThrow("YOUTUBE_API_KEY")}`;

                return forkJoin({
                    videoDetails: this.httpService.get(videoDetailsUrl),
                    playlistDetails: this.httpService.get(playlistDetailsUrl),
                }).pipe(
                    map(({ videoDetails, playlistDetails }) => {
                        return [
                            ...this.processVideoItems(videoItems, videoDetails.data.items),
                            ...this.processPlaylistItems(playlistItems, playlistDetails.data.items),
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



}