import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { UserEntity } from '@Entities/user.entity';

@Injectable()
export class EncryptService {
  constructor(private configService: ConfigService) {}

  encryptActivateToken(_user: UserEntity): string {
    const encryptSecert = this.configService.get<string>('secret.encrypt');
    const ivString = this.configService.get<string>('secret.iv');
    const bufferSecret = Buffer.from(encryptSecert, 'utf8');
    const bufferIV = Buffer.from(ivString, 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', bufferSecret, bufferIV);

    const data = {
      userId: _user.id,
      userEmai: _user.email,
      activateCode: _user.activateCode,
    };

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return Buffer.from(encrypted, 'base64').toString('hex');
  }

  encryptUnlockOrResetPasswordToken(_user: UserEntity): string {
    const encryptSecert = this.configService.get<string>('secret.encrypt');
    const ivString = this.configService.get<string>('secret.iv');
    const bufferSecret = Buffer.from(encryptSecert, 'utf8');
    const bufferIV = Buffer.from(ivString, 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', bufferSecret, bufferIV);

    const data = {
      userId: _user.id,
      userEmai: _user.email,
      resetCode: _user.resetCode,
    };

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return Buffer.from(encrypted, 'base64').toString('hex');
  }

  decryptToken(encryptedString: string): string {
    const realEncrypeted = Buffer.from(encryptedString, 'hex');

    const encryptSecert = this.configService.get<string>('secret.encrypt');
    const ivString = this.configService.get<string>('secret.iv');
    const bufferSecret = Buffer.from(encryptSecert, 'utf8');
    const bufferIV = Buffer.from(ivString, 'utf8');
    const decipher = crypto.createDecipheriv('aes-256-cbc', bufferSecret, bufferIV);

    let decryptedData = decipher.update(realEncrypeted, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  }
}
