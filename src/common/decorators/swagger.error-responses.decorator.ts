import { ApiProperty } from '@nestjs/swagger';

class ErrorResponse {
  @ApiProperty()
  readonly status: number = 0;

  @ApiProperty()
  message: string;
}

export class ConflictResponse extends ErrorResponse {
  @ApiProperty({ default: 409 })
  statusCode = 409;
}

export class NotFoundResponse extends ErrorResponse {
  @ApiProperty({ default: 404 })
  statusCode = 404;
}

export class InternalServerErrorResponse extends ErrorResponse {
  @ApiProperty({ default: 500 })
  statusCode = 500;
}

export class ForbiddenResponse extends ErrorResponse {
  @ApiProperty({ default: 403 })
  statusCode = 403;
}

export class UnauthorizedResponse extends ErrorResponse {
  @ApiProperty({ default: 401 })
  statusCode = 401;
}

export class NotAcceptableResponse extends ErrorResponse {
  @ApiProperty({ default: 406 })
  statusCode = 406;
}

export class BadRequestResponse extends ErrorResponse {
  @ApiProperty({ default: 400 })
  statusCode = 400;
}

export class UnsupportedMediaTypeResponse extends ErrorResponse {
  @ApiProperty({ default: 415 })
  statusCode = 415;
}

export class ValidationFailResponse extends ErrorResponse {
  @ApiProperty({ default: 400 })
  statusCode = 400;

  @ApiProperty({ type: [String] })
  errors = [];
}
