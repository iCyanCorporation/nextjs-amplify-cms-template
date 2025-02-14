"use client";
import React from 'react';
import { useTheme } from 'next-themes';

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="animated-bg fixed top-0 left-0 w-full h-full -z-10">
      <div className="gradient-orb"></div>
      <div className="gradient-orb delay-2"></div>
      <div className="gradient-orb delay-4"></div>
      <style jsx>{`
        .animated-bg {
          overflow: hidden;
          background: linear-gradient(to bottom right, var(--bg-start), var(--bg-end));
          --bg-start: ${isDark ? '#13151a' : '#ffffff'};
          --bg-end: ${isDark ? '#090b11' : '#f5f5f7'};
        }
        .gradient-orb {
          position: absolute;
          width: 70vw;
          height: 70vw;
          border-radius: 50%;
          background: radial-gradient(circle at center, ${isDark ? 'rgba(125, 90, 255, 0.2)' : 'rgba(173, 216, 230, 0.4)'}, transparent 70%);
          animation: float 20s ease-in-out infinite;
          pointer-events: none;
        }
        .delay-2 {
          animation-delay: -5s;
          background: radial-gradient(circle at center, ${isDark ? 'rgba(255, 123, 234, 0.15)' : 'rgba(255, 182, 193, 0.3)'}, transparent 70%);
        }
        .delay-4 {
          animation-delay: -10s;
          background: radial-gradient(circle at center, ${isDark ? 'rgba(90, 203, 255, 0.15)' : 'rgba(176, 224, 230, 0.35)'}, transparent 70%);
        }
        @keyframes float {
          0%, 100% {
            transform: translate(-25%, -25%) rotate(0deg);
          }
          25% {
            transform: translate(25%, 25%) rotate(90deg);
          }
          50% {
            transform: translate(25%, -25%) rotate(180deg);
          }
          75% {
            transform: translate(-25%, 25%) rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
