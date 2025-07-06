import { GoogleGenAI } from "@google/genai";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface RelevantContent {
  content: string;
  category: string;
  metadata: any;
  similarity: number;
}

class AIService {
  private static instance: AIService;
  private genAI: GoogleGenAI;

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Enhanced query analysis for better context understanding
  private analyzeQuery(query: string): {
    intent: string;
    category: string;
    tone: string;
    complexity: string;
    keywords: string[];
  } {
    const queryLower = query.toLowerCase();

    // Intent detection
    let intent = "general";
    if (
      queryLower.includes("tell me about") ||
      queryLower.includes("who are") ||
      queryLower.includes("about you")
    ) {
      intent = "introduction";
    } else if (
      queryLower.includes("project") ||
      queryLower.includes("work") ||
      queryLower.includes("built")
    ) {
      intent = "showcase";
    } else if (
      queryLower.includes("skill") ||
      queryLower.includes("technology") ||
      queryLower.includes("know")
    ) {
      intent = "technical";
    } else if (
      queryLower.includes("experience") ||
      queryLower.includes("job") ||
      queryLower.includes("company")
    ) {
      intent = "professional";
    } else if (
      queryLower.includes("contact") ||
      queryLower.includes("hire") ||
      queryLower.includes("collaborate")
    ) {
      intent = "contact";
    } else if (
      queryLower.includes("how") ||
      queryLower.includes("why") ||
      queryLower.includes("what")
    ) {
      intent = "explanatory";
    }

    // Category detection
    let category = "general";
    if (
      queryLower.includes("project") ||
      queryLower.includes("github") ||
      queryLower.includes("demo")
    ) {
      category = "projects";
    } else if (
      queryLower.includes("experience") ||
      queryLower.includes("work") ||
      queryLower.includes("job")
    ) {
      category = "experience";
    } else if (
      queryLower.includes("skill") ||
      queryLower.includes("technology") ||
      queryLower.includes("programming")
    ) {
      category = "skills";
    } else if (
      queryLower.includes("education") ||
      queryLower.includes("college") ||
      queryLower.includes("degree")
    ) {
      category = "education";
    } else if (
      queryLower.includes("contact") ||
      queryLower.includes("email") ||
      queryLower.includes("reach")
    ) {
      category = "contact";
    }

    // Tone detection
    let tone = "professional";
    if (
      queryLower.includes("awesome") ||
      queryLower.includes("cool") ||
      queryLower.includes("amazing")
    ) {
      tone = "enthusiastic";
    } else if (
      queryLower.includes("please") ||
      queryLower.includes("could you") ||
      queryLower.includes("would you")
    ) {
      tone = "polite";
    } else if (
      queryLower.includes("quick") ||
      queryLower.includes("brief") ||
      queryLower.includes("short")
    ) {
      tone = "concise";
    }

    // Complexity detection
    let complexity = "medium";
    if (
      query.length < 50 ||
      queryLower.includes("what") ||
      queryLower.includes("who")
    ) {
      complexity = "simple";
    } else if (
      query.length > 150 ||
      queryLower.includes("explain") ||
      queryLower.includes("detail")
    ) {
      complexity = "detailed";
    }

    // Extract keywords
    const keywords = query
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 3 &&
          ![
            "about",
            "tell",
            "what",
            "where",
            "when",
            "with",
            "from",
            "that",
            "this",
            "they",
            "them",
            "there",
            "their",
          ].includes(word.toLowerCase()),
      );

    return { intent, category, tone, complexity, keywords };
  }

  public async generateResponseStream(
    query: string,
    relevantContent: RelevantContent[],
    onChunk: (chunk: string) => void,
    conversationHistory: ConversationMessage[] = [],
  ): Promise<void> {
    try {
      const queryAnalysis = this.analyzeQuery(query);
      const prompt = this.buildEnhancedPrompt(
        query,
        relevantContent,
        conversationHistory,
        queryAnalysis,
      );

      console.log(`🎯 Query Analysis: ${JSON.stringify(queryAnalysis)}`);

      const result = await this.genAI.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: {
          role: "user",
          parts: [{ text: prompt }],
        },
      });

      for await (const chunk of result) {
        if (
          chunk.candidates &&
          chunk.candidates.length > 0 &&
          chunk.candidates[0].content &&
          chunk.candidates[0].content.parts &&
          chunk.candidates[0].content.parts.length > 0
        ) {
          const textChunk = chunk.candidates[0].content.parts[0].text;
          if (textChunk) {
            onChunk(textChunk);
          }
        }
      }
    } catch (error) {
      console.error("Error generating response stream:", error);
      await this.handleStreamError(onChunk, query);
    }
  }

  private buildEnhancedPrompt(
    query: string,
    relevantContent: RelevantContent[],
    conversationHistory: ConversationMessage[],
    queryAnalysis: ReturnType<typeof this.analyzeQuery>,
  ): string {
    // Group content by category and relevance
    const contentByCategory = relevantContent.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, RelevantContent[]>);

    // Build structured context with priority ordering
    const contextSections = Object.entries(contentByCategory)
      .sort(([catA], [catB]) => {
        // Prioritize category that matches query category
        if (catA === queryAnalysis.category) return -1;
        if (catB === queryAnalysis.category) return 1;
        return 0;
      })
      .map(([category, items]) => {
        const categoryContent = items
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 3) // Top 3 items per category
          .map((item, index) => {
            const metadata = this.formatMetadata(item.metadata);
            const similarityScore = `(${(item.similarity * 100).toFixed(
              1,
            )}% relevant)`;
            return `${index + 1}. ${item.content}${
              metadata ? `\n   📝 ${metadata}` : ""
            } ${similarityScore}`;
          })
          .join("\n\n");

        return `## ${category.toUpperCase()} INFORMATION:\n${categoryContent}`;
      })
      .join("\n\n");

    // Build conversation context (last 3 exchanges)
    const recentHistory = conversationHistory
      .slice(-6)
      .map(
        (msg) =>
          `${msg.role === "user" ? "👤 User" : "🤖 Pankaj"}: ${msg.content}`,
      )
      .join("\n");

    // Dynamic personality based on query analysis
    const personalityPrompt = this.getPersonalityPrompt(queryAnalysis);

    return `${personalityPrompt}

QUERY ANALYSIS:
- Intent: ${queryAnalysis.intent}
- Category: ${queryAnalysis.category}
- Tone: ${queryAnalysis.tone}
- Complexity: ${queryAnalysis.complexity}
- Key Topics: ${queryAnalysis.keywords.join(", ")}

AVAILABLE KNOWLEDGE BASE:
${contextSections}

${recentHistory ? `RECENT CONVERSATION:\n${recentHistory}\n` : ""}

CURRENT QUESTION: "${query}"

RESPONSE GUIDELINES FOR THIS QUERY:
${this.getResponseGuidelines(queryAnalysis)}

Now respond as Pankaj with enthusiasm and personality!`;
  }

  private getPersonalityPrompt(
    queryAnalysis: ReturnType<typeof this.analyzeQuery>,
  ): string {
    const basePersonality = `You are Pankaj Thakur, a passionate Junior Software Developer from Bihar, India.

CORE PERSONALITY TRAITS:
- Enthusiastic about technology and always eager to learn
- Friendly, approachable, and genuinely excited to share knowledge
- Humble but confident about your skills and achievements
- Love for remote work and modern development practices
- Strong problem-solving mindset with a collaborative spirit

BACKGROUND HIGHLIGHTS:
- Currently working in Ahmedabad, Gujarat
- Specialize in full-stack development (React.js, Node.js, TypeScript)
- Passionate about AI development tools (Cursor, Windsurf, VS Code Copilot)
- Built impressive projects including social media platforms and workflow systems
- Always learning and staying updated with latest tech trends`;

    // Customize based on query analysis
    if (queryAnalysis.intent === "introduction") {
      return `${basePersonality}

CURRENT CONTEXT: Someone wants to know more about who you are. Be warm, personal, and share your journey with genuine enthusiasm.`;
    }

    if (queryAnalysis.intent === "showcase") {
      return `${basePersonality}

CURRENT CONTEXT: Someone is interested in your work and projects. Show your passion for building things and highlight your technical achievements with pride.`;
    }

    if (queryAnalysis.intent === "technical") {
      return `${basePersonality}

CURRENT CONTEXT: Technical discussion. Share your expertise confidently while showing your continuous learning mindset.`;
    }

    if (queryAnalysis.intent === "professional") {
      return `${basePersonality}

CURRENT CONTEXT: Professional discussion. Be professional but maintain your enthusiastic personality.`;
    }

    return basePersonality;
  }

  private getResponseGuidelines(
    queryAnalysis: ReturnType<typeof this.analyzeQuery>,
  ): string {
    let guidelines = `- Speak in first person as Pankaj ("I built...", "My experience with...")
- Use specific examples and technical details from the knowledge base
- Show genuine enthusiasm for technology and learning
- Include relevant links or references when mentioning projects`;

    if (queryAnalysis.complexity === "simple") {
      guidelines += `\n- Keep the response concise but informative
- Focus on the most relevant information
- Use clear, direct language`;
    } else if (queryAnalysis.complexity === "detailed") {
      guidelines += `\n- Provide comprehensive details and examples
- Share the story behind your projects and experiences
- Include technical specifics and learning outcomes`;
    }

    if (queryAnalysis.tone === "enthusiastic") {
      guidelines += `\n- Match the enthusiasm! Use exclamation marks and positive language
- Share your passion for the topic
- Be excited about your achievements`;
    } else if (queryAnalysis.tone === "polite") {
      guidelines += `\n- Be respectful and professional
- Thank them for their question
- Offer additional help`;
    }

    if (queryAnalysis.category === "projects") {
      guidelines += `\n- Highlight the technical challenges and solutions
- Mention the technologies used and why you chose them
- Share live demo links or GitHub repositories when relevant`;
    } else if (queryAnalysis.category === "experience") {
      guidelines += `\n- Focus on growth, learning, and contributions
- Mention specific accomplishments and responsibilities
- Connect past experience to current skills`;
    }

    guidelines += `\n- End with an engaging question or invitation to continue the conversation
- Keep the response natural and conversational, not robotic`;

    return guidelines;
  }

  private formatMetadata(metadata: any): string {
    if (!metadata || typeof metadata !== "object") return "";

    const formatted = Object.entries(metadata)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(", ")}`;
        }
        return `${key}: ${value}`;
      })
      .join(" | ");

    return formatted;
  }

  private async handleStreamError(
    onChunk: (chunk: string) => void,
    originalQuery: string,
  ): Promise<void> {
    const errorMessages = [
      "I'm having a technical hiccup right now 😅",
      "Hmm, something went wrong on my end. Let me try to help you anyway!",
      "Oops! I encountered an issue, but I'm still here to help.",
      "Sorry about that technical glitch! Let me get back on track.",
    ];

    const randomError =
      errorMessages[Math.floor(Math.random() * errorMessages.length)];
    const fallbackResponse = `${randomError} 

Could you try asking your question again? I'm usually much more reliable than this! 

If you're asking about my projects, I'd love to tell you about the social media platform I built or my workflow management system. For technical questions, I'm passionate about React, Node.js, and AI development tools. 

What would you like to know? 🚀`;

    const words = fallbackResponse.split(" ");
    for (const word of words) {
      onChunk(word + " ");
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

export const aiService = AIService.getInstance();
