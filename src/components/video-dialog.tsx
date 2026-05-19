"use client";

import { useEffect, useRef } from "react";

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export function VideoDialog({ isOpen, onClose, videoUrl, title }: VideoDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-bg/80 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />
      <div 
        ref={dialogRef}
        className="relative w-full max-w-3xl bg-card border border-border rounded-lg shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card-alt/50">
          <span className="text-xs font-mono text-fg uppercase tracking-wider font-bold">
            {title} — Demo
          </span>
          <button 
            onClick={onClose}
            className="text-xs font-mono text-muted hover:text-fg transition-colors duration-150"
          >
            Close ✕
          </button>
        </div>
        <div className="aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
