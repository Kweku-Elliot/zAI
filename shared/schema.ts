import { pgTable, text, timestamp, boolean, integer, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  profileImage: text("profile_image"),
  phoneNumber: text("phone_number"),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  credits: decimal("credits", { precision: 10, scale: 2 }).default("0.00"),
  plan: text("plan").default("free"), // free, premium, enterprise
  planExpiresAt: timestamp("plan_expires_at"),
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),
  preferences: json("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chats table
export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isGroup: boolean("is_group").default(false),
  participants: json("participants"), // array of user IDs for group chats
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").references(() => chats.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // text, image, file, voice, video
  metadata: json("metadata"),
  encrypted: boolean("encrypted").default(false),
  aiGenerated: boolean("ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // credit_purchase, credit_send, credit_receive, ai_usage
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(), // pending, completed, failed, cancelled
  description: text("description"),
  paymentMethod: text("payment_method"), // paystack, stripe, manual
  paymentReference: text("payment_reference"),
  recipientId: text("recipient_id").references(() => users.id),
  metadata: json("metadata"),
  aiValidated: boolean("ai_validated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group Wallets table
export const groupWallets = pgTable("group_wallets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: text("owner_id").references(() => users.id).notNull(),
  members: json("members"), // array of user IDs
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  currency: text("currency").default("USD"),
  isActive: boolean("is_active").default(true),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gift Credits table
export const giftCredits = pgTable("gift_credits", {
  id: text("id").primaryKey(),
  senderId: text("sender_id").references(() => users.id).notNull(),
  recipientId: text("recipient_id").references(() => users.id),
  recipientEmail: text("recipient_email"),
  recipientPhone: text("recipient_phone"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  message: text("message"),
  code: text("code").unique().notNull(),
  qrCode: text("qr_code"),
  status: text("status").notNull(), // pending, claimed, expired, cancelled
  expiresAt: timestamp("expires_at"),
  claimedAt: timestamp("claimed_at"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Usage Analytics table
export const usageAnalytics = pgTable("usage_analytics", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  feature: text("feature").notNull(), // chat, image_gen, file_analysis, voice_transcription
  usageType: text("usage_type").notNull(), // tokens, requests, minutes, files
  amount: integer("amount").notNull(),
  cost: decimal("cost", { precision: 10, scale: 4 }),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertChatSchema = createInsertSchema(chats);
export const insertMessageSchema = createInsertSchema(messages);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertGroupWalletSchema = createInsertSchema(groupWallets);
export const insertGiftCreditSchema = createInsertSchema(giftCredits);
export const insertUsageAnalyticsSchema = createInsertSchema(usageAnalytics);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Chat = typeof chats.$inferSelect;
export type InsertChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type GroupWallet = typeof groupWallets.$inferSelect;
export type InsertGroupWallet = typeof groupWallets.$inferInsert;
export type GiftCredit = typeof giftCredits.$inferSelect;
export type InsertGiftCredit = typeof giftCredits.$inferInsert;
export type UsageAnalytics = typeof usageAnalytics.$inferSelect;
export type InsertUsageAnalytics = typeof usageAnalytics.$inferInsert;