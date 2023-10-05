import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { string } from "joi";
export enum StreamQuality {
  "High",
  "Low",
}
export class StreamDto {
  @IsString()
  @ApiProperty({ type: "string", required: true })
  link: string;
  @IsOptional()
  @IsEnum(StreamQuality)
  @ApiProperty({
    enum: StreamQuality,
    required: false,
    default: StreamQuality.High,
  })
  quality: StreamQuality = StreamQuality.Low;
}
