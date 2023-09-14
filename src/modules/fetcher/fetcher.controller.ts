import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FetcherService } from "./fetcher.service";
import { Response } from "express";
import { FetchInfoDto } from "./fetcher.dto";

@Controller({
  path: "search",
  version: "1",
})
@ApiTags("Search")
export class FetcherController {
  constructor(private readonly fetcherService: FetcherService) {}

  @Get("search")
  @ApiQuery({ name: "keyWord", type: String, required: true })
  @ApiQuery({ name: "limit", type: Number, required: false })
  async searchKeyWord(
    @Query("keyWord") keyWord: string,
    @Query("limit") limit: number = 10,
    @Res() response: Response
  ) {
    this.fetcherService.searchKeyWord({ keyWord, limit }).subscribe(
      (searchResult) => {
        response.status(200).json({
          success: true,
          data: searchResult,
        });
      },
      (err) => {
        response.status(500).json({
          success: false,
          message: err.message,
        });
      }
    );
  }

  @Post("info")
  @ApiBody({ type: FetchInfoDto, required: true })
  @ApiConsumes("application/x-www-form-urlencoded")
  getVideoInfo(@Body() { url }: FetchInfoDto, @Res() response: Response) {
    return this.fetcherService.getVideoDetailsFromUrl(url).subscribe({
      next(data) {
        response.status(200).json({
          success: true,
          data,
        });
      },
      error(err) {
        response.status(500).json({
          success: false,
          message: err.message,
        });
      },
    });
  }
}
