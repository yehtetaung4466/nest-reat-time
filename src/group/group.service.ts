import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { and, eq, ilike, like } from 'drizzle-orm';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { groups, members } from 'src/drizzle/schema';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly memberService: MemberService,
  ) {}
  async createGroup(name: string, founderId: number) {
    const createdGroup = await this.drizzleService.db
      .insert(groups)
      .values({ name })
      .returning()
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'groups_name_unique') {
            throw new ConflictException('group name already exit');
          }
        }
      });
    await this.drizzleService.db.insert(members).values({
      group_id: createdGroup[0].id,
      user_id: founderId,
      role: 'admin',
    });

    return { msg: 'successfully created a group' };
  }
  async retrieveAllGroups(name?: string) {
    if (name) {
      return await this.drizzleService.db
        .select()
        .from(groups)
        .where(ilike(groups.name, `%${name}%`));
    } else {
      return await this.drizzleService.db.select().from(groups);
    }
  }
  async deleteGroupById(userId: number, groupId: number) {
    const groupIsExit = await this.checkIfgroupExit(groupId);
    const userRole = await this.memberService.getRoleOfMemberOfGroup(
      userId,
      groupId,
    );
    if (!groupIsExit) {
      throw new NotFoundException('group not found');
    }
    if (userRole === -1) {
      throw new UnauthorizedException('You are not authorized for this action');
    }
    if (userRole === 'admin') {
      await this.memberService.kickAllMemberOut(groupId);
      await this.drizzleService.db.delete(groups).where(eq(groups.id, groupId));
      return { msg: 'successfully Deleted' };
    } else {
      throw new UnauthorizedException('You are not authorized for this action');
    }
  }

  private async checkIfgroupExit(groupId: number) {
    return !!(await this.drizzleService.db.query.groups.findFirst({
      where: eq(groups.id, groupId),
    }));
  }
}
