import { relations } from 'drizzle-orm';
import { date, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  createdAt: date('createdAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  type: varchar('type', { length: 256, enum: ['open', 'approval'] })
    .notNull()
    .default('open'),
  createdAt: date('createdAt').defaultNow().notNull(),
});
export const members = pgTable(
  'members',
  {
    id: serial('id').primaryKey(),
    group_id: serial('group_id')
      .notNull()
      .references(() => groups.id),
    user_id: serial('user_id')
      .notNull()
      .references(() => users.id),
    role: varchar('role', { length: 256, enum: ['user', 'manager', 'admin'] })
      .notNull()
      .default('user'),
  },
  (t) => ({
    userGroupUq: unique('userGropuUq').on(t.group_id, t.user_id),
  }),
);

export const gp_messages = pgTable('gp_messages', {
  id: serial('id').primaryKey(),
  message: varchar('message', { length: 256 }).notNull(),
  group_id: serial('group_id')
    .notNull()
    .references(() => groups.id),
  sender_id: serial('sender_id')
    .notNull()
    .references(() => users.id),
  createdAt: date('createdAt').defaultNow().notNull(),
});

export const userRelation = relations(users, ({ many }) => ({
  members: many(members),
  gp_messages: many(gp_messages),
}));
export const groupRelation = relations(groups, ({ many }) => ({
  gp_messages: many(gp_messages),
  members: many(members),
}));
export const memberRelation = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.user_id],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [members.group_id],
    references: [groups.id],
  }),
}));

export const gp_messagesRelation = relations(gp_messages, ({ one }) => ({
  group: one(groups, {
    fields: [gp_messages.group_id],
    references: [groups.id],
  }),
  sender: one(users, {
    fields: [gp_messages.sender_id],
    references: [users.id],
  }),
}));
