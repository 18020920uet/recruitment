import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async sendAccountActivationMail(_user: UserEntity, token: string) {
    const host = this.configService.get<string>('host');
    const url = `${host}/account/activate?token=${token}`;

    const a = await this.mailerService.sendMail({
      to: _user.email,
      subject: 'Welcome to Recruitment! Confirm your Email',
      template: './activation',
      context: {
        name: `${_user.firstName} ${_user.lastName}`,
        url,
      },
    });
  }
}
