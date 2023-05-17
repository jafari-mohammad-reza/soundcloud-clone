import {MongooseModule} from "@nestjs/mongoose";

export const MongooseConf = MongooseModule.forRoot("mongodb://172.28.0.3:27017", {dbName: "sound-cloud"})
