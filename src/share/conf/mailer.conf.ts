import {MailerModule} from '@nestjs-modules/mailer';
import {ConfigModule, ConfigService} from '@nestjs/config';

export const MailerConf = MailerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        transport: {
            service: 'gmail',
            from: 'soundClone',
            auth: {
                user: configService.getOrThrow('EMAIL_USER'),
                pass: configService.getOrThrow('EMAIL_PASSWORD'),
            },
        },
        defaults: {
            from: 'API_SOUND_CLONE',
        },
    }),
});
