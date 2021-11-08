import { BadRequestException } from '@nestjs/common';

export class ValidationExeption extends BadRequestException {
  constructor(public validationErrors: string[]) {
    super()
  }
}
