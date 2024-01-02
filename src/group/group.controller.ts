import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { GroupDto } from './dto/group.dto';
import { JwtPayload } from 'src/utils/token.payload';
import { MemberService } from 'src/member/member.service';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly memberService: MemberService,
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  makeNewGroup(@Req() req: Request, @Body() body: GroupDto) {
    const user = req.user as JwtPayload;
    return this.groupService.createGroup(body.name, user.sub);
  }
  @Post(':groupId/members')
  @UseGuards(JwtAuthGuard)
  joinGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayload;
    return this.memberService.createMember(groupId, user.sub);
  }
}
