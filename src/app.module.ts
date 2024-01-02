import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { WsModule } from './ws/ws.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    WsModule,
    DrizzleModule,
    UserModule,
    GroupModule,
    MemberModule,
  ],
})
export class AppModule {}
