'use client';

import { useEffect, useRef, useState } from 'react';

// Counts up (expo-out) the first time it is seen. Renders the final value on the
// server and without JS; reduced motion skips the animation.
export default function CountUp({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1800);
          setShown(t === 1 ? value : value * (1 - Math.pow(2, -10 * t)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setShown(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const text = shown.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref}>{prefix}{text}{suffix}</span>;
}
