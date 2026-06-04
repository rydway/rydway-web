import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, html: string, text?: string): Promise<void>;
    sendNotificationEmail(to: string, firstName: string, title: string, message: string): Promise<void>;
}
