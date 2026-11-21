'use client';

import { useEffect } from 'react';

// Page-wide behaviour for /kaleid: grain, reveal-once, lit panels, magnetic pills, counters.
export default function Effects() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups = [];
    const root = document.querySelector('.kaleid-page');

    // Film grain: 128px noise tile made once.
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    root.style.setProperty('--grain', `url(${c.toDataURL()})`);

    // Sections sharpen in once.
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          reveal.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
    cleanups.push(() => reveal.disconnect());

    // Light under the pointer on .lit panels.
    const onLit = (e) => {
      const el = e.target.closest?.('.lit');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    root.addEventListener('pointermove', onLit, { passive: true });
    cleanups.push(() => root.removeEventListener('pointermove', onLit));

    // Magnetic pills lean toward the pointer.
    if (!reduced) {
      const pills = [...document.querySelectorAll('.magnetic')];
      const onMag = (e) => {
        for (const p of pills) {
          const r = p.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const near = Math.hypot(dx, dy) < 140;
          p.style.setProperty('--tx', near ? `${dx * 0.28}px` : '0px');
          p.style.setProperty('--ty', near ? `${dy * 0.36}px` : '0px');
        }
      };
      addEventListener('pointermove', onMag, { passive: true });
      cleanups.push(() => removeEventListener('pointermove', onMag));
    }

    // Figures count up (expo-out) the first time they are seen.
    const counters = [...document.querySelectorAll('[data-count]')];
    const fmt = (el, v) => {
      const d = Number(el.dataset.decimals || 0);
      el.textContent = `${v.toFixed(d)}${el.dataset.suffix || ''}`;
    };
    if (!reduced) {
      counters.forEach((el) => fmt(el, 0));
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            io.unobserve(e.target);
            const el = e.target;
            const to = Number(el.dataset.count);
            const start = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - start) / 1800);
              fmt(el, to * (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((f) => f());
  }, []);

  return null;
}
