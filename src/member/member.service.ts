import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, not } from 'drizzle-orm';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { members } from 'src/drizzle/schema';

@Injectable()
export class MemberService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async createMember(groupId: number, userId: number) {
    await this.drizzleService.db
      .insert(members)
      .values({ group_id: groupId, user_id: userId })
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'userGropuUq') {
            throw new BadRequestException('you already joined the group');
          }
          if (err.constraint_name === 'members_group_id_groups_id_fk') {
            throw new NotFoundException('group not found');
          }
        }
      });
    return { msg: 'successfully joined' };
  }
  async getMemberByGroupId(groupId) {
    const memberS = await this.drizzleService.db.query.members.findMany({
      where: eq(members.group_id, groupId),
    });
    return memberS;
  }
  async isGroupMember(userId: number, groupId: number) {
    return !!(await this.drizzleService.db.query.members.findFirst({
      where: and(eq(members.group_id, groupId), eq(members.user_id, userId)),
    }));
  }
  async getRoleOfMemberOfGroup(userId: number, groupId: number) {
    const member = await this.drizzleService.db.query.members.findFirst({
      where: and(eq(members.user_id, userId), eq(members.group_id, groupId)),
      columns: {
        role: true,
      },
    });
    if (!member) {
      return -1;
    }
    return member.role;
  }
  async kickAllMemberOut(groupId: number, exceptedUserId?: number) {
    if (!exceptedUserId) {
      await this.drizzleService.db
        .delete(members)
        .where(eq(members.group_id, groupId));
    } else {
      await this.drizzleService.db
        .delete(members)
        .where(
          and(
            eq(members.group_id, groupId),
            not(eq(members.user_id, exceptedUserId)),
          ),
        );
    }
    return { msg: 'successfully kick all member out' };
  }
}
