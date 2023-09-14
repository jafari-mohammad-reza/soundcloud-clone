import { IsEnum, IsString, IsUrl, isURL } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SongQuality } from "../../share/interfaces/content.interface";

export class DownloadDto {
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
  @IsEnum(SongQuality)
  @ApiProperty({ required: true, enum: SongQuality })
  quality: SongQuality;
}
