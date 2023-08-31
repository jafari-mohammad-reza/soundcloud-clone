import {MongooseModule} from '@nestjs/mongoose';

export const MongooseConf = MongooseModule.forRoot(
    process.env.MONGODB_URL,
    {dbName: 'sound-cloud'},
);
