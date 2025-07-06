import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding, getContextualContent } from "@/lib/embeddings";
import { aiService } from "@/lib/gemini";
import {
  addMessageToConversation,
  getConversationHistory,
} from "@/lib/conversation";

// Performance optimizations
const EMBEDDING_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Cache cleanup interval
let cleanupInterval: NodeJS.Timeout | null = null;

interface CacheEntry {
  embedding: number[];
  timestamp: number;
}

// Initialize cache cleanup
if (!cleanupInterval) {
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of EMBEDDING_CACHE.entries()) {
      if (typeof entry === "object" && "timestamp" in entry) {
        if (now - entry.timestamp > CACHE_TTL) {
          EMBEDDING_CACHE.delete(key);
        }
      }
    }
  }, CACHE_CLEANUP_INTERVAL);
}

// Input validation and sanitization
function validateInput(
  message: string,
  sessionId: string,
): { isValid: boolean; error?: string } {
  if (!message || typeof message !== "string") {
    return { isValid: false, error: "Message must be a non-empty string" };
  }

  if (!sessionId || typeof sessionId !== "string") {
    return { isValid: false, error: "SessionId must be a non-empty string" };
  }

  // Sanitize message
  const sanitizedMessage = message.trim();
  if (sanitizedMessage.length === 0) {
    return { isValid: false, error: "Message cannot be empty" };
  }

  if (sanitizedMessage.length > 2000) {
    return { isValid: false, error: "Message too long (max 2000 characters)" };
  }

  return { isValid: true };
}

// Enhanced embedding generation with caching
async function getCachedEmbedding(message: string): Promise<number[] | null> {
  const normalizedMessage = message.toLowerCase().trim();
  const cacheKey = `emb_${normalizedMessage}`;

  // Check cache first
  const cached = EMBEDDING_CACHE.get(cacheKey);
  if (cached) {
    if (
      typeof cached === "object" &&
      "embedding" in cached &&
      "timestamp" in cached
    ) {
      const entry = cached as CacheEntry;
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        console.log(
          `🎯 Cache hit for embedding: ${normalizedMessage.substring(
            0,
            50,
          )}...`,
        );
        return entry.embedding;
      }
    }
  }

  try {
    const embedding = await generateEmbedding(normalizedMessage);
    if (embedding) {
      const numberArray = embedding.map((num) => Number(num));
      // Cache the result
      EMBEDDING_CACHE.set(cacheKey, {
        embedding: numberArray,
        timestamp: Date.now(),
      });
      console.log(
        `💾 Cached new embedding: ${normalizedMessage.substring(0, 50)}...`,
      );
      return numberArray;
    }
  } catch (error) {
    console.error("Error generating embedding:", error);
  }

  return null;
}

// Enhanced error handling
function createErrorResponse(error: string, status: number = 500) {
  console.error(`API Error: ${error}`);
  return NextResponse.json(
    {
      error,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7),
    },
    { status },
  );
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const key = `rate_${sessionId}`;
  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count++;
  return true;
}

// Enhanced context preparation
function prepareContextualContent(relevantContent: any[], message: string) {
  // Sort by similarity and relevance
  const sortedContent = relevantContent
    .sort((a, b) => {
      const simA = Number(a.similarity) || 0;
      const simB = Number(b.similarity) || 0;
      return simB - simA;
    })
    .slice(0, 8); // Limit to top 8 most relevant

  return sortedContent.map((item) => ({
    content: item.content,
    category: item.category,
    metadata: item.metadata,
    similarity: Number(item.similarity) || 0,
  }));
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let sessionId: string = "";

  try {
    const body = await request.json();
    const { message, sessionId: reqSessionId } = body;
    sessionId = reqSessionId;

    // Input validation
    const validation = validateInput(message, sessionId);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    // Rate limiting
    if (!checkRateLimit(sessionId)) {
      return createErrorResponse(
        "Rate limit exceeded. Please wait before sending another message.",
        429,
      );
    }

    const sanitizedMessage = message.trim();
    console.log(
      `🚀 Processing query: "${sanitizedMessage}" (Session: ${sessionId})`,
    );

    // Parallel operations for better performance
    const [historyPromise, embeddingPromise] = [
      getConversationHistory(sessionId).catch((error) => {
        console.error("Error fetching history:", error);
        return []; // Return empty array on error
      }),
      getCachedEmbedding(sanitizedMessage),
    ];

    const [history, queryEmbedding] = await Promise.all([
      historyPromise,
      embeddingPromise,
    ]);

    if (!queryEmbedding) {
      return createErrorResponse(
        "Failed to generate embedding for your message. Please try again.",
        500,
      );
    }

    // Get contextual content
    const relevantContent = await getContextualContent(
      sanitizedMessage,
      queryEmbedding,
      8,
    );
    const formattedContent = prepareContextualContent(
      relevantContent,
      sanitizedMessage,
    );

    console.log(
      `📊 Found ${formattedContent.length} relevant pieces of content`,
    );
    console.log(`⚡ Processing time so far: ${Date.now() - startTime}ms`);

    // Enhanced streaming response with better error handling
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        let chunkCount = 0;
        const streamStartTime = Date.now();

        // Helper function to send data
        const sendData = (data: any) => {
          try {
            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`),
            );
          } catch (error) {
            console.error("Error sending stream data:", error);
          }
        };

        // Send initial metadata
        sendData({
          type: "metadata",
          relevantSources: formattedContent.length,
          processingTime: Date.now() - startTime,
          sessionId,
        });

        try {
          // Start saving user message asynchronously (fire and forget)
          addMessageToConversation(sessionId, {
            role: "user",
            content: sanitizedMessage,
            timestamp: new Date(),
          }).catch((error) =>
            console.error("Error saving user message:", error),
          );

          // Generate AI response with enhanced streaming
          await aiService.generateResponseStream(
            sanitizedMessage,
            formattedContent,
            (chunk: string) => {
              if (chunk && chunk.trim()) {
                chunkCount++;
                fullResponse += chunk;
                sendData({
                  type: "chunk",
                  chunk,
                  chunkIndex: chunkCount,
                });
              }
            },
            history,
          );

          // Save AI response asynchronously
          addMessageToConversation(sessionId, {
            role: "assistant",
            content: fullResponse,
            timestamp: new Date(),
          }).catch((error) =>
            console.error("Error saving AI response:", error),
          );

          // Send completion data
          sendData({
            type: "complete",
            done: true,
            fullResponse,
            relevantSources: formattedContent.length,
            streamingTime: Date.now() - streamStartTime,
            totalTime: Date.now() - startTime,
            chunkCount,
            sessionId,
          });

          console.log(
            `✅ Stream completed: ${chunkCount} chunks in ${
              Date.now() - streamStartTime
            }ms`,
          );
        } catch (error) {
          console.error("Error during streaming:", error);
          sendData({
            type: "error",
            error:
              "I encountered an issue while generating my response. Please try asking your question again!",
            canRetry: true,
            sessionId,
          });
        } finally {
          controller.close();
        }
      },

      cancel() {
        console.log(`🛑 Stream cancelled for session: ${sessionId}`);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Content-Type-Options": "nosniff",
        "X-Response-Time": `${Date.now() - startTime}ms`,
      },
    });
  } catch (error) {
    console.error("Critical error in chat API:", error);

    // Attempt to save error to conversation if sessionId is available
    if (sessionId) {
      addMessageToConversation(sessionId, {
        role: "assistant",
        content: "I encountered an unexpected error. Please try again.",
        timestamp: new Date(),
      }).catch((e) => console.error("Error saving error message:", e));
    }

    return createErrorResponse(
      "An unexpected error occurred. Please try again in a moment.",
      500,
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
