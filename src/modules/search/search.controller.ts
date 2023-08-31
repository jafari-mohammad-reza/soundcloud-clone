import {Controller, Get, Query} from "@nestjs/common";
import {ApiQuery, ApiTags} from "@nestjs/swagger";
import {SearchService} from "./search.service";

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
    async searchKeyWord(@Query("keyWord") keyWord:string , @Query("limit") limit:Number=10){
        return await this.searchService.searchKeyWord({keyWord, limit})
    }
}