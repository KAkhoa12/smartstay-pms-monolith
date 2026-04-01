import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { buildApiResponse } from './api-response';

@Catch()
export class HttpExceptionResponseFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as string | { message?: string | string[] };
      const message = this.resolveMessage(exceptionResponse, exception.message);

      response.status(status).json(buildApiResponse(false, message, {}));
      return;
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(buildApiResponse(false, 'Internal server error', {}));
  }

  private resolveMessage(exceptionResponse: string | { message?: string | string[] }, fallback: string) {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse?.message === 'string') {
      return exceptionResponse.message;
    }

    if (Array.isArray(exceptionResponse?.message)) {
      return exceptionResponse.message.join(', ');
    }

    return fallback;
  }
}
