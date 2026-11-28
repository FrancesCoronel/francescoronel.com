"use client";

export function Marquee({
  children,
  speed = 30,
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  // With reduced motion the strip stops moving, so let people scroll it by hand
  return (
    <div className="overflow-hidden whitespace-nowrap motion-reduce:overflow-x-auto">
      <div
        className="inline-flex animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>
    </div>
  );
}
