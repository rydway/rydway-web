import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP Mail Transporter initialized for host: ${host}`);
    } else {
      this.logger.warn('SMTP configuration is missing. MailService will run in mock logging mode.');
    }
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    const from = this.configService.get<string>('SMTP_FROM', 'Rydway <no-reply@rydway.com>');

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to,
          subject,
          html,
          text,
        });
        this.logger.log(`Email successfully sent to ${to} with subject: "${subject}"`);
      } catch (err: any) {
        this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      }
    } else {
      this.logger.log(`[MOCK EMAIL] TO: ${to} | SUBJECT: "${subject}"\nBODY:\n${text || html}\n`);
    }
  }

  async sendNotificationEmail(to: string, firstName: string, title: string, message: string) {
    const subject = `Rydway: ${title}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg">
        <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Rydway Notification</h2>
        <p>Hello ${firstName || 'User'},</p>
        <p style="font-size: 16px; color: #334155; line-height: 1.5;">${message}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">This is an automated notification from Rydway. Please do not reply to this email.</p>
      </div>
    `;
    const text = `Hello ${firstName || 'User'},\n\n${message}\n\nThis is an automated notification from Rydway.`;
    await this.sendEmail(to, subject, html, text);
  }
}
