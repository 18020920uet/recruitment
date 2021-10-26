import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async sendAccountActivationMail(_user: UserEntity, token: string) {
    const clientHost = this.configService.get<string>('clientHost');

    const actiaveUrl = `${clientHost}/account/activate?token=${token}`;

    const mode = this.configService.get('node_env');
    const isDevelopmentMode = mode == 'development' ? true : false;

    await this.mailerService.sendMail({
      to: _user.email,
      subject: 'Welcome to Recruitment! Confirm your Email',
      template: './activate-account',
      context: {
        fullName: `${_user.firstName} ${_user.lastName}`,
        isDevelopmentMode,
        actiaveUrl,
      },
    });
  }

  async sendAccountUnlockMail(_user: UserEntity, token: string) {
    const clientHost = this.configService.get<string>('clientHost');

    const unlockUrl = `${clientHost}/account/unlock?token=${token}`

    const mode = this.configService.get('node_env');
    const isDevelopmentMode = mode == 'development' ? true : false;

    await this.mailerService.sendMail({
      to: _user.email,
      subject: 'Unlock account from Recruitment',
      template: './unlock-account',
      context: {
        fullName: `${_user.firstName} ${_user.lastName}`,
        unlockUrl,
        isDevelopmentMode,
      },
    });
  }

  async sendAccountRequestResetPasswordMail(_user: UserEntity, token: string) {
    const clientHost = this.configService.get<string>('clientHost');

    const resetPasswordUrl = `${clientHost}/account/reset-password?token=${token}`;

    const mode = this.configService.get('node_env');
    const isDevelopmentMode = mode == 'development' ? true : false;

    await this.mailerService.sendMail({
      to: _user.email,
      subject: 'Reset password',
      template: './reset-password-account',
      context: {
        fullName: `${_user.firstName} ${_user.lastName}`,
        resetPasswordUrl,
        isDevelopmentMode,
      },
    });
  }
}
