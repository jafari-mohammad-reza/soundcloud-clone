import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication} from "@nestjs/common";

export function swaggerConf(app: INestApplication) {

    const config = new DocumentBuilder().setTitle("Sound cloud clone").setDescription("sound cloud clone api by  mohammadrezajafari.dev@gmail.com").setVersion("1.0.0").addBearerAuth({type: "http"}).build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}
