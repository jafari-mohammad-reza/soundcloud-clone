import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class SearchDto {
    @IsString()
    @Min(3)
    @Max(50)
    keyWord:string
    @IsNumber()
    @IsOptional()
    @Min(10)
    @Max(20)
    limit:Number
}