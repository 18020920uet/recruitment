import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('mail.host'),
          secure: false,
          auth: {
            user: config.get('mail.user'),
            pass: config.get('mail.password'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('mail.from')}>`,
        },
        template: {
          dir: join(__dirname, '/templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, ConfigService],
  exports: [MailService],
})
export class MailModule {}
