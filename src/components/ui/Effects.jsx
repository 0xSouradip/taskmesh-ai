'use client';

import { useEffect } from 'react';

// Page-wide behaviour, mounted once in the root layout:
// grain tile, reveal-once sections, light under the pointer on .lit panels,
// and magnetic pills. (Count-up figures are ui/CountUp.jsx.) A MutationObserver picks up elements
// that appear later (client navigation, filtered lists), so nothing stays hidden.
export default function Effects() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.body;
    root.classList.add('js');

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

    // Reveal once.
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          reveal.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const seen = new WeakSet();
    const scan = () => {
      for (const el of document.querySelectorAll('.reveal:not(.in)')) {
        if (seen.has(el)) continue;
        seen.add(el);
        reveal.observe(el);
      }
    };
    scan();
    let pending = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(scan);
    });
    mo.observe(root, { childList: true, subtree: true });

    // Light under the pointer on .lit panels.
    const onLit = (e) => {
      const el = e.target.closest?.('.lit');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    root.addEventListener('pointermove', onLit, { passive: true });

    // Magnetic pills lean toward a nearby pointer.
    const onMag = (e) => {
      if (reduced || e.pointerType === 'touch') return;
      for (const p of document.querySelectorAll('.magnetic')) {
        const r = p.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < 140;
        p.style.setProperty('--tx', near ? `${dx * 0.28}px` : '0px');
        p.style.setProperty('--ty', near ? `${dy * 0.36}px` : '0px');
      }
    };
    addEventListener('pointermove', onMag, { passive: true });

    return () => {
      reveal.disconnect();
      mo.disconnect();
      cancelAnimationFrame(pending);
      root.removeEventListener('pointermove', onLit);
      removeEventListener('pointermove', onMag);
    };
  }, []);

  return null;
}
