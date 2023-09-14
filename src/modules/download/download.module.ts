import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { DownloadQueueName } from "../../share/constants/queueus";
import { ConvertService } from "../convert/convert.service";
import { FetcherService } from "../fetcher/fetcher.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { FetcherModule } from "../fetcher/fetcher.module";
import { ConvertModule } from "../convert/convert.module";
import { AXIOS_INSTANCE_TOKEN } from "@nestjs/axios/dist/http.constants";
import { DownloadController } from "./download.controller";
import { DownloadService } from "./download.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: DownloadQueueName,
      limiter: {
        max: 100,
        bounceBack: true,
        duration: 25000,
      },
    }),
    HttpModule,
  ],
  providers: [DownloadService, ConvertService, FetcherService],
  controllers: [DownloadController],
})
export class DownloadModule {}
