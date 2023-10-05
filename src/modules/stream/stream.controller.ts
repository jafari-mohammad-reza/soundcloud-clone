import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { StreamDto } from "./stream.dto";
import { Response } from "express";
import ytdl from "ytdl-core";

@Controller({
  path:"stream",
  version : "1"
})
export class StreamController {
  @Get()
  async streamAudio(@Query('url') url: string, @Res() res: Response): Promise<any> {
    ytdl.getInfo(url).then(info => {
      const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
      if (format) {
        res.set({
          'Content-Type': format.mimeType,
          'Content-Disposition': `attachment; filename="audio.${format.container}"`
        });
        ytdl.downloadFromInfo(info, { format: format }).pipe(res);
      } else {
        res.status(400).send('No suitable audio format found');
      }
    }).catch(err => {
      console.error(err);
      res.status(500).send('An error occurred while processing your request');
    });
  }
}
