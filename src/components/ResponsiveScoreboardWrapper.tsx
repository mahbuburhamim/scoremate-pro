import React, { useRef, useState, useEffect } from 'react';

interface ResponsiveScoreboardWrapperProps {
  children: React.ReactNode;
  designWidth?: number;
  className?: string;
}

/**
 * ResponsiveScoreboardWrapper
 * Automatically calculates container width in real-time and scales
 * broadcast overlays (1240px design width) to fit ANY screen size
 * (from 320px mobile up to 4K monitors) with zero horizontal clipping.
 */
export const ResponsiveScoreboardWrapper: React.FC<ResponsiveScoreboardWrapperProps> = ({
  children,
  designWidth = 1240,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const containerWidth = el.offsetWidth;
      if (containerWidth > 0) {
        // Leave 12px breathing room so border never touches container edges
        const availableWidth = Math.max(280, containerWidth - 12);
        const calculatedScale = Math.min(1, availableWidth / designWidth);
        setScale(calculatedScale);
      }
    };

    updateScale();

    // ResizeObserver catches all responsive layout changes, orientation shifts & drawer opens
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateScale);
      observer.observe(el);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [designWidth]);

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center items-end overflow-hidden ${className}`}
    >
      <div
        style={{
          width: `${designWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'bottom center',
          height: `${Math.ceil(106 * scale)}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          transition: 'transform 0.15s ease-out, height 0.15s ease-out',
        }}
      >
        <div style={{ width: `${designWidth}px` }} className="shrink-0 flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
