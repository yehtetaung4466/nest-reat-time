import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GeneralHttpException } from './exceptions/generalHttpException';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseException } from './exceptions/databaseException';
import { GeneralErrorException } from './exceptions/generalErrorException';
import { GeneralWsException } from './exceptions/generalWsException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  app.useGlobalFilters(
    // new GeneralErrorException(),
    new GeneralHttpException(),
    new GeneralWsException(),
    new DatabaseException(),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
//