import React, { useEffect, useRef } from 'react';

const ClickSpark: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const spark = document.createElement('div');
      const x = e.clientX;
      const y = e.clientY;

      spark.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
      `;

      // Create 8 particles bursting outward
      const colors = ['#2D6A4F', '#F4A300', '#FFFFFF', '#52B788'];
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('span');
        const angle = (i / 8) * 360;
        const color = colors[i % colors.length];

        particle.style.cssText = `
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${color};
          animation: spark-fly 0.6s ease-out forwards;
          transform: rotate(${angle}deg) translateX(0);
          --angle: ${angle}deg;
        `;
        spark.appendChild(particle);
      }

      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <div ref={containerRef}>{children}</div>
      <style>{`
        @keyframes spark-fly {
          0% {
            transform: rotate(var(--angle)) translateX(0px);
            opacity: 1;
            width: 8px;
            height: 8px;
          }
          100% {
            transform: rotate(var(--angle)) translateX(40px);
            opacity: 0;
            width: 4px;
            height: 4px;
          }
        }
      `}</style>
    </>
  );
};

export default ClickSpark;