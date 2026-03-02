import type { ReactNode } from 'react';

interface MediaShowcaseProps {
  children: ReactNode;
  height: string;
  className?: string;
}

export function MediaShowcase({ children, height, className = '' }: MediaShowcaseProps) {
  return (
    <div
      className={`relative w-full rounded-xl bg-black border border-border dark:border-[rgba(255,255,255,0.1)] ${className}`.trim()}
      style={{ minHeight: height }}
    >
      {children}
    </div>
  );
}
