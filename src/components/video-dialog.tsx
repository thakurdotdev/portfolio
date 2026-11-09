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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="bezel relative z-10 w-full max-w-4xl"
      >
        <div className="bezel-inner">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span id="video-dialog-title" className="text-sm font-medium text-fg">
            {title} demo
          </span>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close demo dialog"
            className="btn btn-surface btn-icon h-8 w-8 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 z-10 text-white text-xs font-mono">
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Loading video…</span>
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
                Open the video ↗
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
    </div>
  );
}
