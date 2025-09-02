'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type StickyBackdropProps = React.PropsWithChildren<{
  className?: string;
}>;

export function StickyBackdrop({ className, children }: StickyBackdropProps) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = React.useState(false);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry) {
          return;
        }
        setIsStuck(!firstEntry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div aria-hidden="true" className="h-px" ref={sentinelRef} />
      <div className={cn(className, isStuck && 'py-4')}>{children}</div>
    </>
  );
}
