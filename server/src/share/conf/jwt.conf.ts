import {JwtModule} from "@nestjs/jwt";
import {doc} from "prettier";
import {join} from "path"
import {readFileSync} from "fs"

export const JwtConf = JwtModule.register({
    global:true,
    publicKey : join(__dirname , ".." ,"..",".." , "jwtRS256.key.pub"),
    privateKey :join(__dirname , ".." ,"..",".." , "jwtRS256.key"),
    signOptions : {algorithm:"RS256" ,expiresIn:1800 },
    verifyOptions:{algorithms:["RS256"] ,}
})
