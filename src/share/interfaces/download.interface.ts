import { FfmpegCommand } from "fluent-ffmpeg";
import { Observable } from "rxjs";

export interface DownloadedMusic {
  data?: FfmpegCommand;
  filePath: string;
  title: string;
}
