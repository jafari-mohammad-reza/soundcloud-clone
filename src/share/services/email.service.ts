import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  private readonly _logger: Logger;

  constructor(private readonly mailerService: MailerService) {
    this._logger = new Logger(EmailService.name);
  }

  async sendEmail(to: string, subject: string, content: any) {
    try {
      await this.mailerService
        .sendMail({
          from: "soundClone@gmail.com",
          to,
          subject,
          html: `<body>${content}</body>`,
        })
        .then(() => {
          this._logger.log(
            `sent verification email to ${to} in ${new Date()
              .getTime()
              .toLocaleString()}`
          );
        })
        .catch((err) => {
          this._logger.error(
            `failed to send email to ${to} in ${new Date()
              .getTime()
              .toLocaleString()}`
          );
        });
    } catch (err) {
      this._logger.error("Failed to send email");
    }
  }
}
