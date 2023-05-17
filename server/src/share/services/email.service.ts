import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {map} from "rxjs"
@Injectable()
export class EmailService {
    constructor(private readonly configService:ConfigService){

    }
    sendEmail(target:string , title:string , content:string) {
        
    }
}