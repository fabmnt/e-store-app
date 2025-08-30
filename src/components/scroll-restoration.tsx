// app/scroll-to-top.tsx
'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // Run on route change (and optionally search param change)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, []);

  return null;
}
