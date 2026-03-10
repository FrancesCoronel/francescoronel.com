"use client";

import { useEffect, useState } from "react";

export function ClientOnlyText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Tag className={className} aria-hidden />;
  return <Tag className={className}>{text}</Tag>;
}
