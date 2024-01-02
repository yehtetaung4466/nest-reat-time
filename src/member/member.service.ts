import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
}
