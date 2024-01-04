import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { MemberService } from 'src/member/member.service';
import { GroupGateway } from './group.gateway';
import { JwtModule } from '@nestjs/jwt';
import { GroupMessageService } from 'src/group-message/group-message.service';

@Module({
  imports: [DrizzleModule, JwtModule],
  controllers: [GroupController],
  providers: [GroupService, MemberService, GroupGateway, GroupMessageService],
})
export class GroupModule {}
