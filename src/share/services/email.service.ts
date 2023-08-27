import {Injectable, Logger} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    private readonly _loggger: Logger;

    constructor(private readonly mailerService: MailerService) {
        this._loggger = new Logger(EmailService.name);
    }

    async sendEmail(to: string, subject: string, content: any) {
        try {
            await this.mailerService.sendMail({
                from: 'soundClone@gmail.com',
                to,
                subject,
                html: `<body>${content}</body>`,
            });
        } catch (err) {
            this._loggger.error('Failed to send email');
        }
    }
}
