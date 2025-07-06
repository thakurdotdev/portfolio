import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Enhanced query preprocessing
function preprocessQuery(query: string): string {
  // Remove excessive whitespace and normalize
  let cleanQuery = query.trim().replace(/\s+/g, " ");

  // Expand common abbreviations for better semantic matching
  const expansions = {
    js: "javascript",
    ts: "typescript",
    react: "react reactjs",
    node: "nodejs node.js",
    ai: "artificial intelligence",
    ml: "machine learning",
    ui: "user interface",
    ux: "user experience",
    api: "application programming interface",
    db: "database",
    frontend: "front-end client-side",
    backend: "back-end server-side",
    fullstack: "full-stack full stack",
    dev: "developer development",
    eng: "engineer engineering",
    exp: "experience",
    proj: "project",
    tech: "technology",
    prog: "programming",
    lang: "language",
    framework: "framework library",
    tool: "tool software",
    app: "application",
    web: "web website",
    mobile: "mobile app application",
    responsive: "responsive design",
    css: "css styling",
    html: "html markup",
    sql: "sql database",
    nosql: "nosql database",
    aws: "amazon web services cloud",
    gcp: "google cloud platform",
    azure: "microsoft azure cloud",
  };

  // Apply expansions (case insensitive)
  Object.entries(expansions).forEach(([abbr, expansion]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, "gi");
    cleanQuery = cleanQuery.replace(regex, expansion);
  });

  // Add context keywords for better matching
  const contextKeywords = {
    project: "portfolio project work built developed created",
    experience: "work job role position company experience background",
    skill: "skill technology knowledge expertise proficiency",
    education: "education degree college university study learning",
    contact: "contact reach connect email linkedin portfolio",
    about: "about background personal biography who pankaj",
  };

  // Add relevant context keywords
  Object.entries(contextKeywords).forEach(([keyword, context]) => {
    if (cleanQuery.toLowerCase().includes(keyword)) {
      cleanQuery += ` ${context}`;
    }
  });

  return cleanQuery.toLowerCase();
}

export async function generateEmbedding(
  prompt: string,
): Promise<Number[] | undefined> {
  try {
    const cleanPrompt = preprocessQuery(prompt);

    console.log(`🔍 Original query: "${prompt}"`);
    console.log(`🔧 Preprocessed query: "${cleanPrompt}"`);

    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: cleanPrompt,
    });

    if (response && response.embeddings && response.embeddings.length > 0) {
      return response.embeddings[0].values;
    } else {
      throw new Error("No embeddings found in the response");
    }
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// Enhanced similarity search with better threshold management
export async function findSimilarContent(
  queryEmbedding: number[],
  limit: number = 8,
  threshold: number = 0.2,
) {
  const { db } = await import("./db");
  const { portfolioData } = await import("./schema");
  const { sql } = await import("drizzle-orm");

  const semanticResults = await db
    .select({
      id: portfolioData.id,
      content: portfolioData.content,
      category: portfolioData.category,
      metadata: portfolioData.metadata,
      similarity: sql`1 - (${portfolioData.embedding} <=> ${JSON.stringify(
        queryEmbedding,
      )}::vector)`,
    })
    .from(portfolioData)
    .where(
      sql`1 - (${portfolioData.embedding} <=> ${JSON.stringify(
        queryEmbedding,
      )}::vector) > ${threshold}`,
    )
    .orderBy(
      sql`${portfolioData.embedding} <=> ${JSON.stringify(
        queryEmbedding,
      )}::vector`,
    )
    .limit(limit);

  console.log(
    `🎯 Found ${semanticResults.length} semantic results above threshold ${threshold}`,
  );

  return semanticResults;
}

// Enhanced contextual content retrieval with smarter matching
export async function getContextualContent(
  query: string,
  queryEmbedding: number[],
  limit: number = 8,
) {
  const { db } = await import("./db");
  const { portfolioData } = await import("./schema");
  const { sql, eq, or, like, and } = await import("drizzle-orm");

  const queryLower = query.toLowerCase();
  const results = new Map<string, any>();

  // Enhanced keyword patterns with weighted categories
  const keywordPatterns = {
    projects: {
      keywords: [
        "project",
        "github",
        "demo",
        "code",
        "built",
        "developed",
        "app",
        "application",
        "live",
        "portfolio",
        "repository",
        "showcase",
        "work",
        "created",
        "website",
        "platform",
        "system",
        "tool",
        "software",
      ],
      weight: 0.95,
    },
    experience: {
      keywords: [
        "work",
        "job",
        "company",
        "role",
        "experience",
        "engineer",
        "developer",
        "intern",
        "netclues",
        "employment",
        "career",
        "position",
        "professional",
        "workplace",
        "team",
        "responsibility",
      ],
      weight: 0.9,
    },
    skills: {
      keywords: [
        "skill",
        "technology",
        "tech",
        "language",
        "framework",
        "tool",
        "programming",
        "javascript",
        "react",
        "node",
        "typescript",
        "css",
        "html",
        "database",
        "api",
        "frontend",
        "backend",
        "fullstack",
        "proficiency",
        "expertise",
        "knowledge",
        "ability",
        "competency",
      ],
      weight: 0.85,
    },
    education: {
      keywords: [
        "education",
        "degree",
        "college",
        "university",
        "study",
        "bachelor",
        "engineering",
        "marwadi",
        "academic",
        "qualification",
        "learning",
        "course",
        "curriculum",
        "student",
        "graduation",
      ],
      weight: 0.8,
    },
    personal: {
      keywords: [
        "about",
        "who",
        "background",
        "from",
        "bihar",
        "remote",
        "learn",
        "passion",
        "personal",
        "biography",
        "introduction",
        "personality",
        "interests",
        "hobbies",
        "preferences",
        "story",
        "journey",
      ],
      weight: 0.85,
    },
    contact: {
      keywords: [
        "contact",
        "email",
        "reach",
        "connect",
        "portfolio",
        "linkedin",
        "github",
        "social",
        "communication",
        "networking",
        "hire",
        "collaborate",
      ],
      weight: 0.75,
    },
  };

  // 1. Get semantic similarity results with adaptive threshold
  let semanticResults = await findSimilarContent(queryEmbedding, limit, 0.2);

  // If few results, lower threshold
  if (semanticResults.length < 3) {
    semanticResults = await findSimilarContent(queryEmbedding, limit, 0.1);
  }

  semanticResults.forEach((result) => {
    results.set(result.id.toString(), { ...result, source: "semantic" });
  });

  // 2. Enhanced keyword matching with weighted scoring
  const matchingCategories = Object.entries(keywordPatterns)
    .filter(([_, config]) =>
      config.keywords.some((keyword) => queryLower.includes(keyword)),
    )
    .map(([category, config]) => ({ category, weight: config.weight }));

  // 3. Get category-specific content with weighted similarity
  if (matchingCategories.length > 0) {
    const categoryResults = await db
      .select({
        id: portfolioData.id,
        content: portfolioData.content,
        category: portfolioData.category,
        metadata: portfolioData.metadata,
        similarity: sql`0.9`, // Base similarity for keyword matches
      })
      .from(portfolioData)
      .where(
        or(
          ...matchingCategories.map(({ category }) =>
            eq(portfolioData.category, category),
          ),
        ),
      )
      .limit(limit);

    categoryResults.forEach((result) => {
      const categoryConfig = matchingCategories.find(
        (c) => c.category === result.category,
      );
      const weightedSimilarity = categoryConfig ? categoryConfig.weight : 0.9;

      const existingResult = results.get(result.id.toString());
      if (
        !existingResult ||
        Number(existingResult.similarity) < weightedSimilarity
      ) {
        results.set(result.id.toString(), {
          ...result,
          similarity: weightedSimilarity,
          source: "keyword",
        });
      }
    });
  }

  // 4. Special handling for project-related queries with better filtering
  if (
    queryLower.includes("project") ||
    queryLower.includes("github") ||
    queryLower.includes("demo") ||
    queryLower.includes("portfolio") ||
    queryLower.includes("work") ||
    queryLower.includes("built")
  ) {
    const allProjects = await db
      .select()
      .from(portfolioData)
      .where(eq(portfolioData.category, "projects"));

    allProjects.forEach((project) => {
      const existingResult = results.get(project.id.toString());
      if (!existingResult || Number(existingResult.similarity) < 0.95) {
        results.set(project.id.toString(), {
          id: project.id,
          content: project.content,
          category: project.category,
          metadata: project.metadata,
          similarity: 0.95,
          source: "project_boost",
        });
      }
    });
  }

  // 5. Content diversity enhancement - ensure variety in results
  const finalResults = Array.from(results.values()).sort(
    (a, b) => Number(b.similarity) - Number(a.similarity),
  );

  // Ensure category diversity in top results
  const diverseResults = [];
  const categoryCount: { [key: string]: number } = {};
  const maxPerCategory = Math.ceil(limit / Object.keys(keywordPatterns).length);

  for (const result of finalResults) {
    const category = result.category;
    if (!categoryCount[category]) categoryCount[category] = 0;

    if (
      categoryCount[category] < maxPerCategory ||
      diverseResults.length < limit
    ) {
      diverseResults.push(result);
      categoryCount[category]++;
    }

    if (diverseResults.length >= limit) break;
  }

  // Fill remaining slots with highest similarity if needed
  if (diverseResults.length < limit) {
    for (const result of finalResults) {
      if (!diverseResults.find((r) => r.id === result.id)) {
        diverseResults.push(result);
        if (diverseResults.length >= limit) break;
      }
    }
  }

  console.log(`📊 Final results: ${diverseResults.length} items`);
  console.log(`📈 Category distribution:`, categoryCount);
  console.log(
    "📋 Result breakdown:",
    diverseResults
      .map(
        (r) =>
          `[${r.category}] ${Number(r.similarity).toFixed(3)} (${r.source})`,
      )
      .join(", "),
  );

  return diverseResults.slice(0, limit);
}
