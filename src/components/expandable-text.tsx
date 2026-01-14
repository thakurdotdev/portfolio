"use client";

import { useState, useRef, useEffect } from "react";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
}

export function ExpandableText({ text, maxLines = 2 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [collapsedHeight, setCollapsedHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight =
        parseInt(getComputedStyle(contentRef.current).lineHeight) || 20;
      setCollapsedHeight(lineHeight * maxLines);
    }
  }, [maxLines]);

  useEffect(() => {
    if (contentRef.current) {
      if (expanded) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(collapsedHeight);
      }
    }
  }, [expanded, collapsedHeight]);

  const needsTruncation = text.length > 80;

  return (
    <div>
      <div
        ref={contentRef}
        className="text-sm text-muted overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: needsTruncation ? height || collapsedHeight : undefined,
        }}
      >
        {text}
      </div>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-accent hover:underline mt-1.5 transition-colors"
        >
          {expanded ? "← Less" : "More →"}
        </button>
      )}
    </div>
  );
}
