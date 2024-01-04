import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
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
      .returning();
    return newMessage[0];
  }
}
