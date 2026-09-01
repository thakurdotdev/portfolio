"use client";

import { useEffect, useRef, useState } from "react";

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export function VideoDialog({ isOpen, onClose, videoUrl, title }: VideoDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-dialog-title"
    >
      <div
        className="fixed inset-0 bg-bg/85 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative w-full max-w-3xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card-alt/60">
          <span id="video-dialog-title" className="text-xs font-mono text-fg uppercase tracking-wider font-bold">
            {title} — Demo Walkthrough
          </span>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close demo dialog"
            className="inline-flex items-center justify-center w-7 h-7 rounded text-xs font-mono text-muted hover:text-fg hover:bg-card-alt active:scale-95 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 z-10 text-white text-xs font-mono">
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Loading Demo Video...</span>
            </div>
          )}

          {hasError ? (
            <div className="p-8 text-center text-white/80 font-mono text-xs space-y-3">
              <p className="text-rose-400 font-bold">Unable to load video stream</p>
              <p className="text-[11px] text-white/60">Check connection or open the demo directly in a new tab.</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1.5 rounded bg-white text-black font-bold hover:bg-white/90 transition-colors"
              >
                Open Demo URL ↗
              </a>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              onCanPlay={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
