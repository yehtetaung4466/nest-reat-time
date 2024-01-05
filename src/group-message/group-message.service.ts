import { BadRequestException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { gp_messages } from 'src/drizzle/schema';

@Injectable()
export class GroupMessageService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async getAllMessageInGroup(groupId: number) {
    return await this.drizzleService.db
      .select()
      .from(gp_messages)
      .where(eq(gp_messages.group_id, groupId));
  }
  async createNewGroupMessage(
    senderId: number,
    groupId: number,
    message: string,
  ) {
    const newMessage = await this.drizzleService.db
      .insert(gp_messages)
      .values({ group_id: groupId, sender_id: senderId, message })
      .returning()
      .catch((e) => {
        if (e instanceof PostgresError) {
          if ((e.constraint_name = 'gp_messages_group_id_groups_id_fk')) {
            throw new BadRequestException('invalid group');
          }
        }
      });
    return newMessage[0];
  }
}
