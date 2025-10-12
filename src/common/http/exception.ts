import type { ZodError } from "zod";
import { HttpException } from "./http";

export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request', errors: unknown[] = []) {
    super(400, message);
    this.stack = undefined;
    this.errors = errors;
  }
}

export class ZodBadRequestException extends BadRequestException {
  constructor(error: ZodError) {
    super('Validation failed', error.issues);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message);
    this.stack = undefined;
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.stack = undefined;
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.stack = undefined;
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super(409, message);
    this.stack = undefined;
  }
}

export class UnprocessableEntity extends HttpException {
  constructor(message: string = 'Unprocessable Entity') {
    super(422, message);
    this.stack = undefined;
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
    this.stack = undefined;
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(message: string = 'Service Unavailable') {
    super(503, message);
    this.stack = undefined;
  }
}

export class GatewayTimeoutException extends HttpException {
  constructor(message: string = 'Gateway Timeout') {
    super(504, message);
    this.stack = undefined;
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message: string = 'Too Many Requests') {
    super(429, message);
    this.stack = undefined;
  }
}
