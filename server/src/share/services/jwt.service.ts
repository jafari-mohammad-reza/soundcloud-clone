import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtModuleService {
    constructor(private readonly jwtService:JwtService){}
    async signToken(payload:string|number|string|number[] , exp?:string) : Promise<string>{
        return await this.jwtService.signAsync({payload} , {algorithm:"RS256" , expiresIn:exp || "30m"})
    }
    async verifyToken(token:string) : Promise<any>{
        return await this.jwtService.verifyAsync(token , {algorithms:['RS256']})
    }
}