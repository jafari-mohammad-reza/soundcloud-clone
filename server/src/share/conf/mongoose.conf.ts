import {MongooseModule} from "@nestjs/mongoose";

console.log(process.env.MONGODB_URL)
export const MongooseConf = MongooseModule.forRoot("mongodb://0.0.0.0:27017" , {dbName:"sound-cloud"})
