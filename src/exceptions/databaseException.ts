import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { PostgresError } from 'postgres';
import { Response } from 'express';
@Catch(PostgresError)
export class DatabaseException implements ExceptionFilter {
  catch(exception: PostgresError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message: string = 'database error';
    const status: number = 500;
    response.status(status).json({
      response: exception.stack || message,
    });
  }
}
