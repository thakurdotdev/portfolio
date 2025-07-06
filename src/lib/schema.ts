import {
  pgTable,
  serial,
  text,
  timestamp,
  vector,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const portfolioData = pgTable("portfolio_data", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'experience', 'projects', 'skills', etc.
  metadata: jsonb("metadata"), // Additional context like dates, technologies
  embedding: vector("embedding", { dimensions: 768 }), // Gemini text-embedding-004 size
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  messages: jsonb("messages").notNull(), // Array of {role, content, timestamp}
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PortfolioData = typeof portfolioData.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
