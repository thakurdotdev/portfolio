import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioData } from "@/lib/schema";
import { generateEmbedding } from "@/lib/embeddings";

export async function POST(request: NextRequest) {
  try {
    const { content, category, metadata } = await request.json();

    if (!content || !category) {
      return NextResponse.json(
        { error: "Content and category are required" },
        { status: 400 },
      );
    }

    // Generate embedding
    const embeddingResult = await generateEmbedding(content);

    if (!embeddingResult) {
      return NextResponse.json(
        { error: "Failed to generate embedding" },
        { status: 500 },
      );
    }

    // Convert Number[] to number[] to fix type issue
    const embedding = embeddingResult.map((num) => Number(num));

    // Insert into database
    const [result] = await db
      .insert(portfolioData)
      .values({
        content,
        category,
        metadata: metadata || {},
        embedding,
      })
      .returning();

    return NextResponse.json({
      success: true,
      id: result.id,
      message: "Portfolio data ingested successfully",
    });
  } catch (error) {
    console.error("Error ingesting data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
