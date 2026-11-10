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
        className="fixed inset-0 bg-bg/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-[14px] bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span id="video-dialog-title" className="text-sm font-medium text-fg">
            {title} demo
          </span>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close demo dialog"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-xs text-muted transition-colors hover:text-fg"
          >
            ✕
          </button>
        </div>

        <div className={`relative flex aspect-video items-center justify-center ${hasError ? "bg-surface" : "bg-black"}`}>
          {isLoading && !hasError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 text-sm text-white">
              Loading the video
            </div>
          )}

          {hasError ? (
            <div className="p-8 text-center">
              <p className="font-medium">The video didn&rsquo;t load.</p>
              <p className="mt-1 text-sm text-muted">Check your connection, or open it in a new tab.</p>
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="link mt-4 inline-block text-sm">
                Open the video
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
