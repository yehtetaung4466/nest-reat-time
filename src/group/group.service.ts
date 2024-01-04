import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq, ilike, like } from 'drizzle-orm';
import { PostgresError } from 'postgres';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { groups, members } from 'src/drizzle/schema';

@Injectable()
export class GroupService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async createGroup(name: string, founderId: number) {
    const createdGroup = await this.drizzleService.db
      .insert(groups)
      .values({ name })
      .returning()
      .catch((err) => {
        if (err instanceof PostgresError) {
          if (err.constraint_name === 'groups_name_unique') {
            throw new BadRequestException('group name already exit');
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

  // async checkIfgroupExit(groupId: number) {
  //   return !!(await this.drizzleService.db.query.groups.findFirst({
  //     where: eq(groups.id, groupId),
  //   }));
  // }
}

