import { Module } from "@nestjs/common";
import { StreamService } from "./stream.service";

import { ConvertService } from "../convert/convert.service";

@Module({
  imports: [],
  providers: [StreamService, ConvertService],
})
export class StreamModule {}
