"use client";

import { useEffect, useState } from "react";

export default function AnimatedFlower({
  right,
  top,
  left,
  bottom,
}: {
  right?: number;
  top?: number;
  left?: number;
  bottom?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay the animation start to sync with hero section
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed z-0 pointer-events-none"
      style={{
        top: top !== undefined ? `${top}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
        bottom: bottom !== undefined ? `${bottom}px` : undefined,
      }}
    >
      <div className={`flower ${isVisible ? "flower-visible" : ""}`}>
        <div className="petal petal1"></div>
        <div className="petal petal2"></div>
        <div className="petal petal3"></div>
        <div className="petal petal4"></div>
        <div className="petal petal5"></div>
        <div className="petal petal6"></div>
        <div className="petal petal7"></div>
        <div className="petal petal8"></div>
        <div className="center"></div>
      </div>

      <style jsx>{`
        .flower {
          position: relative;
          width: 400px;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 1s ease, transform 1s ease;
          z-index: -1;
        }

        .flower-visible {
          opacity: 0.4;
          transform: scale(1);
          animation: rotateFlower 12s infinite linear;
        }

        .petal {
          position: absolute;
          width: 65px;
          height: 100px;
          border-radius: 50%;
          animation: changeColor 8s infinite reverse;
        }

        /* Light theme colors (default) */
        .petal {
          background: linear-gradient(180deg, #fce7f3, #f472b6);
        }

        /* Dark theme colors */
        :global(.dark) .petal {
          background: linear-gradient(180deg, #1f2937, #6b7280);
        }

        .petal1 {
          transform: rotate(0deg) translateY(-60px);
          animation-delay: 0.1s;
        }

        .petal2 {
          transform: rotate(45deg) translateY(-60px);
          animation-delay: 0.2s;
        }

        .petal3 {
          transform: rotate(90deg) translateY(-60px);
          animation-delay: 0.3s;
        }

        .petal4 {
          transform: rotate(135deg) translateY(-60px);
          animation-delay: 0.4s;
        }

        .petal5 {
          transform: rotate(180deg) translateY(-60px);
          animation-delay: 0.5s;
        }

        .petal6 {
          transform: rotate(225deg) translateY(-60px);
          animation-delay: 0.6s;
        }

        .petal7 {
          transform: rotate(270deg) translateY(-60px);
          animation-delay: 0.7s;
        }

        .petal8 {
          transform: rotate(315deg) translateY(-60px);
          animation-delay: 0.8s;
        }

        .center {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #f9fafb;
        }

        /* Dark theme center */
        :global(.dark) .center {
          background-color: #374151;
        }

        @keyframes changeColor {
          0% {
            background: linear-gradient(180deg, #fce7f3, #f472b6);
          }
          25% {
            background: linear-gradient(180deg, #fdf2f8, #ec4899);
          }
          50% {
            background: linear-gradient(180deg, #f3e8ff, #a855f7);
          }
          75% {
            background: linear-gradient(180deg, #fef3c7, #f59e0b);
          }
          100% {
            background: linear-gradient(180deg, #ecfdf5, #10b981);
          }
        }

        /* Dark theme color animation */
        :global(.dark) .petal {
          animation: changeColorDark 8s infinite reverse;
        }

        @keyframes changeColorDark {
          0% {
            background: linear-gradient(180deg, #1f2937, #6b7280);
          }
          25% {
            background: linear-gradient(180deg, #111827, #4b5563);
          }
          50% {
            background: linear-gradient(180deg, #1e1b4b, #6366f1);
          }
          75% {
            background: linear-gradient(180deg, #1c1917, #78716c);
          }
          100% {
            background: linear-gradient(180deg, #14532d, #059669);
          }
        }

        @keyframes rotateFlower {
          0% {
            transform: scale(1) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .flower {
            width: 250px;
            height: 250px;
          }

          .petal {
            width: 40px;
            height: 65px;
          }

          .petal1,
          .petal2,
          .petal3,
          .petal4,
          .petal5,
          .petal6,
          .petal7,
          .petal8 {
            transform: rotate(var(--rotation)) translateY(-40px);
          }

          .center {
            width: 15px;
            height: 15px;
          }
        }

        @media (max-width: 480px) {
          .flower {
            width: 180px;
            height: 180px;
          }

          .flower-visible {
            opacity: 0.2;
          }

          .petal {
            width: 30px;
            height: 50px;
          }

          .petal1,
          .petal2,
          .petal3,
          .petal4,
          .petal5,
          .petal6,
          .petal7,
          .petal8 {
            transform: rotate(var(--rotation)) translateY(-30px);
          }
        }
      `}</style>
    </div>
  );
}
