"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy, WrapText } from "lucide-react";
import React, { JSX, useCallback, useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";

// Enhanced language mapping
const LANGUAGE_MAP: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  py: "python",
  md: "markdown",
  json: "json",
  css: "css",
  sh: "bash",
  bash: "bash",
  shell: "bash",
  sql: "sql",
  yml: "yaml",
  yaml: "yaml",
  xml: "xml",
  html: "html",
  php: "php",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rust",
  ruby: "ruby",
};

// Props interfaces
interface ContentRendererProps {
  content: string;
  isStreaming?: boolean;
  enableWordWrap?: boolean;
  maxWidth?: string;
  className?: string;
}

interface CodeBlockProps {
  code: string;
  language: string;
  enableWordWrap?: boolean;
}

interface CopyButtonProps {
  text: string;
  className?: string;
}

interface TableProps {
  headers: string[];
  rows: string[][];
}

// Streaming indicator component
const StreamingIndicator: React.FC = React.memo(() => (
  <div className="flex items-center gap-3 py-4">
    <div className="flex items-center gap-1">
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
    <span className="text-sm text-muted-foreground animate-pulse">
      AI is thinking...
    </span>
  </div>
));

StreamingIndicator.displayName = "StreamingIndicator";

// Enhanced copy button component
const CopyButton: React.FC<CopyButtonProps> = React.memo(
  ({ text, className }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }, [text]);

    return (
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted/80 rounded-md shrink-0",
          isCopied && "opacity-100",
          className,
        )}
        onClick={handleCopy}
        title={isCopied ? "Copied!" : "Copy code"}
      >
        {isCopied ? (
          <Check className="h-3.5 w-3.5 text-green-600" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    );
  },
);

CopyButton.displayName = "CopyButton";

// Enhanced CodeBlock component with proper overflow handling
const CodeBlock: React.FC<CodeBlockProps> = React.memo(
  ({ code, language, enableWordWrap = false }) => {
    const [isWrapped, setIsWrapped] = useState(enableWordWrap);

    const { highlightedCode, mappedLanguage } = useMemo(() => {
      try {
        const mapped =
          LANGUAGE_MAP[language.toLowerCase()] || language.toLowerCase();
        const lang = Prism.languages[mapped];

        if (lang) {
          return {
            highlightedCode: Prism.highlight(code, lang, mapped),
            mappedLanguage: mapped,
          };
        }
        return {
          highlightedCode: code,
          mappedLanguage: language,
        };
      } catch (err) {
        console.warn(`Failed to highlight ${language}:`, err);
        return {
          highlightedCode: code,
          mappedLanguage: language,
        };
      }
    }, [code, language]);

    const toggleWrap = useCallback(() => {
      setIsWrapped((prev) => !prev);
    }, []);

    return (
      <div className="my-6 group w-full">
        <div className="relative rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-sm w-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-muted/30 border-b border-border/30 px-4 py-2.5 min-h-[44px]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {mappedLanguage || "code"}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted/80 rounded-md"
                onClick={toggleWrap}
                title={isWrapped ? "Disable word wrap" : "Enable word wrap"}
              >
                <WrapText
                  className={cn("h-3.5 w-3.5", isWrapped && "text-blue-500")}
                />
              </Button>
              <CopyButton text={code} />
            </div>
          </div>

          {/* Code content with proper overflow handling */}
          <div className="relative w-full">
            <div
              className={cn(
                "w-full",
                !isWrapped && "overflow-x-auto",
                "custom-scrollbar",
              )}
            >
              <pre
                className={cn(
                  "text-sm leading-relaxed p-4 m-0 font-mono text-gray-100",
                  isWrapped
                    ? "whitespace-pre-wrap break-all"
                    : "whitespace-pre",
                  !isWrapped && "min-w-max",
                )}
              >
                <code
                  className={`language-${mappedLanguage}`}
                  dangerouslySetInnerHTML={{
                    __html: highlightedCode,
                  }}
                />
              </pre>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                height: 8px;
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(155, 155, 155, 0.5);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(155, 155, 155, 0.7);
              }
              .custom-scrollbar::-webkit-scrollbar-corner {
                background: transparent;
              }
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  },
);

CodeBlock.displayName = "CodeBlock";

// Inline code component
const InlineCode: React.FC<{ children: string }> = React.memo(
  ({ children }) => (
    <code className="bg-muted/60 border border-border/40 rounded-md px-1.5 py-0.5 text-[0.875em] font-mono font-medium text-foreground/90 break-words">
      {children}
    </code>
  ),
);

InlineCode.displayName = "InlineCode";

// Enhanced table component
const Table: React.FC<TableProps> = React.memo(({ headers, rows }) => (
  <div className="my-6 w-full overflow-hidden rounded-xl border border-border/40 bg-card/50 shadow-sm">
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full min-w-full">
        <thead>
          <tr className="bg-muted/40 border-b border-border/30">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-semibold text-foreground text-sm whitespace-nowrap"
              >
                {formatTextContent(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors duration-150"
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-foreground/90 text-sm"
                >
                  {formatTextContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

Table.displayName = "Table";

// Enhanced text formatting function
const formatTextContent = (text: string): JSX.Element => {
  if (!text || typeof text !== "string") {
    return <span>{text}</span>;
  }

  const formattedText = text
    // Bold text
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-foreground">$1</strong>',
    )
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic text-foreground/80">$1</em>')
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-150" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    // Strikethrough
    .replace(
      /~~(.*?)~~/g,
      '<del class="line-through text-foreground/60">$1</del>',
    );

  return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

// Enhanced content parsing with better performance
const parseContent = (
  text: string,
  enableWordWrap: boolean = false,
): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  const lines = text.split("\n");
  let currentIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).toLowerCase() || "text";
      const codeLines: string[] = [];
      i++; // Skip opening ```

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      elements.push(
        <CodeBlock
          key={currentIndex++}
          code={codeLines.join("\n")}
          language={language}
          enableWordWrap={enableWordWrap}
        />,
      );
      continue;
    }

    // Inline code handling
    if (line.includes("`") && !line.trim().startsWith("```")) {
      const parts = line.split("`");
      const lineElements: (JSX.Element | string)[] = [];

      parts.forEach((part, j) => {
        if (j % 2 === 0) {
          if (part) lineElements.push(formatTextContent(part));
        } else {
          lineElements.push(<InlineCode key={j}>{part}</InlineCode>);
        }
      });

      elements.push(
        <p
          key={currentIndex++}
          className="mb-4 leading-relaxed text-foreground/90 break-words"
        >
          {lineElements}
        </p>,
      );
      continue;
    }

    // Headers
    if (line.startsWith("#")) {
      const level = (line.match(/^#+/) || [""])[0].length;
      const text = line.replace(/^#+\s*/, "");
      const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;

      elements.push(
        <HeaderTag
          key={currentIndex++}
          className={cn(
            "font-semibold mb-4 mt-8 first:mt-0 text-foreground scroll-m-20 break-words",
            level === 1 && "text-3xl border-b border-border/30 pb-3",
            level === 2 && "text-2xl",
            level === 3 && "text-xl",
            level === 4 && "text-lg",
            level === 5 && "text-base",
            level === 6 && "text-sm",
          )}
        >
          {formatTextContent(text)}
        </HeaderTag>,
      );
      continue;
    }

    // Lists (enhanced detection)
    if (line.match(/^\s*[-*+]\s/) || line.match(/^\s*\d+\.\s/)) {
      const listItems: string[] = [line];
      let j = i + 1;

      while (
        j < lines.length &&
        (lines[j].match(/^\s*[-*+]\s/) ||
          lines[j].match(/^\s*\d+\.\s/) ||
          (lines[j].trim() === "" &&
            j + 1 < lines.length &&
            (lines[j + 1].match(/^\s*[-*+]\s/) ||
              lines[j + 1].match(/^\s*\d+\.\s/))))
      ) {
        if (lines[j].trim() !== "") {
          listItems.push(lines[j]);
        }
        j++;
      }

      const isOrdered = line.match(/^\s*\d+\.\s/);
      const ListTag = isOrdered ? "ol" : "ul";

      elements.push(
        <ListTag
          key={currentIndex++}
          className={cn(
            "mb-6 space-y-2 ml-6 text-foreground/90",
            isOrdered ? "list-decimal" : "list-disc",
          )}
        >
          {listItems.map((item, idx) => {
            const text = item
              .replace(/^\s*[-*+]\s*/, "")
              .replace(/^\s*\d+\.\s*/, "");
            return (
              <li key={idx} className="leading-relaxed pl-1 break-words">
                {formatTextContent(text)}
              </li>
            );
          })}
        </ListTag>,
      );

      i = j - 1;
      continue;
    }

    // Tables (enhanced detection)
    if (
      line.includes("|") &&
      lines[i + 1]?.includes("|") &&
      lines[i + 1]?.includes("-")
    ) {
      const tableLines: string[] = [line];
      let j = i + 1;

      // Skip the separator line
      if (lines[j]?.includes("-")) {
        j++;
      }

      // Collect remaining table rows
      while (j < lines.length && lines[j].includes("|") && lines[j].trim()) {
        tableLines.push(lines[j]);
        j++;
      }

      if (tableLines.length >= 1) {
        const headers = tableLines[0]
          .split("|")
          .map((h) => h.trim())
          .filter(Boolean);
        const rows = tableLines.slice(1).map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter(Boolean),
        );

        elements.push(
          <Table key={currentIndex++} headers={headers} rows={rows} />,
        );
        i = j - 1;
        continue;
      }
    }

    // Blockquotes
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      let j = i;

      while (j < lines.length && lines[j].startsWith(">")) {
        quoteLines.push(lines[j].replace(/^>\s?/, ""));
        j++;
      }

      elements.push(
        <blockquote
          key={currentIndex++}
          className="border-l-4 border-blue-500/30 pl-4 py-2 my-4 bg-muted/20 italic text-foreground/80 break-words"
        >
          {quoteLines.map((quoteLine, idx) => (
            <p key={idx} className="mb-2 last:mb-0">
              {formatTextContent(quoteLine)}
            </p>
          ))}
        </blockquote>,
      );

      i = j - 1;
      continue;
    }

    // Horizontal rules
    if (line.trim().match(/^[-*_]{3,}$/)) {
      elements.push(
        <hr key={currentIndex++} className="my-8 border-border/30" />,
      );
      continue;
    }

    // Regular paragraphs
    if (line.trim()) {
      elements.push(
        <p
          key={currentIndex++}
          className="mb-4 leading-relaxed text-foreground/90 break-words"
        >
          {formatTextContent(line)}
        </p>,
      );
    }
  }

  return elements;
};

// Main enhanced content renderer component
const ContentRenderer: React.FC<ContentRendererProps> = React.memo(
  ({
    content,
    isStreaming = false,
    enableWordWrap = false,
    maxWidth,
    className,
  }) => {
    const renderedContent = useMemo(() => {
      if (!content) return [];
      return parseContent(content, enableWordWrap);
    }, [content, enableWordWrap]);

    return (
      <div
        className={cn("w-full", className)}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className="w-full overflow-hidden">
          {renderedContent}
          {isStreaming && <StreamingIndicator />}
        </div>
      </div>
    );
  },
);

ContentRenderer.displayName = "ContentRenderer";

export default ContentRenderer;
