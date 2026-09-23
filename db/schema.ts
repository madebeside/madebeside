import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  message: text('message').notNull(),
  receivedAt: integer('received_at').notNull(),
  expiresAt: integer('expires_at').notNull(),
  consentVersion: text('consent_version').notNull(),
}, table => [index('idx_inquiries_expires_at').on(table.expiresAt), index('idx_inquiries_email_received_at').on(table.email, table.receivedAt)]);

export const portfolio = sqliteTable('portfolio', {
 id:text('id').primaryKey(),title:text('title').notNull(),description:text('description').notNull(),
 alt:text('alt').notNull(),kind:text('kind').notNull(),mime:text('mime').notNull(),
 assetKey:text('asset_key').notNull(),captionKey:text('caption_key'),
 status:text('status').notNull().default('draft'),featured:integer('featured').notNull().default(0),
 sortOrder:integer('sort_order').notNull().default(0),createdAt:integer('created_at').notNull(),
},t=>[index('idx_portfolio_status_order').on(t.status,t.sortOrder)]);

