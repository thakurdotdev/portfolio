import { eq } from "drizzle-orm";
import { db } from "./db";
import { ConversationMessage } from "./gemini";
import { conversations } from "./schema";

export async function getOrCreateConversation(sessionId: string) {
  const existing = await db
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [newConversation] = await db
    .insert(conversations)
    .values({
      sessionId,
      messages: [],
    })
    .returning();

  return newConversation;
}

export async function addMessageToConversation(
  sessionId: string,
  message: ConversationMessage,
) {
  const conversation = await getOrCreateConversation(sessionId);
  const updatedMessages = [
    ...(conversation.messages as ConversationMessage[]),
    message,
  ];

  await db
    .update(conversations)
    .set({
      messages: updatedMessages,
      lastActivity: new Date(),
    })
    .where(eq(conversations.id, conversation.id));

  return updatedMessages;
}

export async function getConversationHistory(
  sessionId: string,
): Promise<ConversationMessage[]> {
  const conversation = await getOrCreateConversation(sessionId);
  return (conversation.messages as ConversationMessage[]) || [];
}
