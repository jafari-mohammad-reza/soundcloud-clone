import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FetcherDto {
  @IsString()
  @Min(3)
  @Max(50)
  keyWord: string;
  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(20)
  limit: Number;
}
export class FetchInfoDto {
  @IsString()
  @IsUrl()
  @ApiProperty({
    required: true,
    type: String,
    name: "url",
    example:
      "https://www.youtube.com/watch?v=GBRAnuT48qo&ab_channel=BMTHOfficialVEVO",
  })
  url: string;
}
