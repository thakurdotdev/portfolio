"use client";

import { useEffect, useRef, useState } from "react";
import { lockScroll } from "@/lib/smooth-scroll";

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

/*
 * A native <dialog>, opened modal: the browser traps focus inside it, makes the page behind
 * it inert, closes it on Escape and hands focus back to the button that opened it. Smooth
 * scrolling is held while it is open, or the wheel would still move the page underneath.
 */
export function VideoDialog({ isOpen, onClose, videoUrl, title }: VideoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      setStatus("loading");
      dialog.showModal();
      lockScroll(true);
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // However it closes (Escape, the button, the backdrop), tidy up in one place.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onDialogClose = () => {
      lockScroll(false);
      onClose();
    };
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [onClose]);

  useEffect(() => () => lockScroll(false), []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="video-dialog-title"
      // A click on the backdrop lands on the dialog itself, outside its panel.
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
      className="video-dialog m-auto w-[calc(100%-2rem)] max-w-4xl overflow-visible bg-transparent p-0 text-fg sm:w-[calc(100%-3rem)]"
    >
      {isOpen && (
        <div className="overflow-hidden rounded-[14px] bg-surface shadow-[0_0_0_1px_var(--color-line)]">
          <div className="flex items-center justify-between gap-4 border-b border-line py-2 pr-2 pl-5">
            <h2 id="video-dialog-title" className="text-meta font-medium">
              {title} demo
            </h2>
            <button
              onClick={() => dialogRef.current?.close()}
              type="button"
              aria-label="Close the demo"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-soft hover:text-fg"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="relative grid aspect-video place-items-center bg-black">
            {status === "error" ? (
              <div className="bg-surface absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <p className="font-medium">The video didn&rsquo;t load.</p>
                  <p className="mt-1 text-meta text-muted">Check your connection, or open it in a new tab.</p>
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="link mt-4 inline-block text-meta">
                    Open the video
                  </a>
                </div>
              </div>
            ) : (
              <>
                {status === "loading" && (
                  <div className="absolute inset-0 z-10 grid place-items-center text-meta text-white/80" role="status">
                    <span className="flex items-center gap-3">
                      <span className="video-loading" aria-hidden="true" />
                      Loading the video
                    </span>
                  </div>
                )}
                <video
                  src={videoUrl}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  onCanPlay={() => setStatus("ready")}
                  onError={() => setStatus("error")}
                />
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
