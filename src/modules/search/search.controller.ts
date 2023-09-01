import {Controller, Get, InternalServerErrorException, Query, Res} from "@nestjs/common";
import {ApiQuery, ApiTags} from "@nestjs/swagger";
import {SearchService} from "./search.service";
import {Response} from "express";

@Controller({
    path : "search",
    version : '1'
})
@ApiTags('Search')
export class SearchController{
    constructor(
        private readonly searchService:SearchService
    ) {
    }
    @Get('search')
    @ApiQuery({name : "keyWord" , type:String,required:true})
    @ApiQuery({name : "limit" , type:Number,required:false })
    async searchKeyWord(@Query("keyWord") keyWord:string , @Query("limit") limit:Number=10,@Res() response:Response){
        this.searchService.searchKeyWord({keyWord, limit}).subscribe({
            next(searchResult){
                response.status(200).json({
                    success:true,
                    data:searchResult
                })
            },
            error(err){
                console.log(err)
                // throw new InternalServerErrorException(err)
            }
        })
    }
}