import { useEffect, useRef, useState } from 'react';
import { buildSpiralPath } from '../lib/spiral';
import './SpiralHero.css';

interface SpiralHeroProps {
  label: string;
  baseScale?: number;
  maxScale?: number;
  rotationSeconds?: number;
}

export function SpiralHero({
  label,
  baseScale = 1,
  maxScale = 1.15,
  rotationSeconds = 15,
}: SpiralHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [spiralPath] = useState(() => buildSpiralPath({}));

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    function onScroll() {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const progress = Math.min(scrollY / (viewportH * 1.5), 1);
      const scale = baseScale + progress * (maxScale - baseScale);
      const opacity = 1 - progress * 0.6;
      el!.style.transform = `scale(${scale.toFixed(3)})`;
      el!.style.opacity = opacity.toFixed(2);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [baseScale, maxScale]);

  return (
    <div ref={wrapRef} className="spiral-hero">
      <div className="spiral-rotor" style={{ animationDuration: `${rotationSeconds}s` }}>
        <svg viewBox="0 0 600 600" width="100%" height="100%" role="img" aria-label={label}>
          <defs>
            <linearGradient id="spiral-fade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d={spiralPath}
            fill="none"
            stroke="url(#spiral-fade)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="300" cy="300" r="3" fill="var(--accent)" />
          <circle cx="300" cy="300" r="5.5" fill="var(--accent)" opacity="0.7" />
          <circle cx="300" cy="300" r="8" fill="var(--accent)" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
