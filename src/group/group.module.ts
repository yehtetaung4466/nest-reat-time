import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { MemberService } from 'src/member/member.service';
import { GroupGateway } from './group.gateway';

@Module({
  imports: [DrizzleModule],
  controllers: [GroupController],
  providers: [GroupService, MemberService, GroupGateway],
})
export class GroupModule {}
