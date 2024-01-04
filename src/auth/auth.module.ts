import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { JwtRefreshStrategy } from './strategies/jwt.refresh.strategy';
import { WsJwtStrategy } from './strategies/jwt.ws.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DrizzleModule],
  providers: [
    JwtStrategy,
    AuthService,
    JwtService,
    JwtRefreshStrategy,
    WsJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
