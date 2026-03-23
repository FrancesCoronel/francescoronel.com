import type { ReactNode } from "react";

interface PageHeaderProps {
  label: string;
  heading: ReactNode;
  description?: string;
  aside?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  label,
  heading,
  description,
  aside,
  children,
}: PageHeaderProps) {
  const textContent = (
    <>
      <p className="text-sm font-bold uppercase tracking-widest text-horchata-700">
        {label}
      </p>
      <h1 className="mt-2 text-4xl font-black text-navy-900 dark:text-horchata-100 md:text-5xl">
        {heading}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-lg text-navy-600 dark:text-white/70">
          {description}
        </p>
      )}
      {children}
    </>
  );

  return (
    <section className="min-h-[480px] bg-horchata-50 py-16 md:py-24 dark:bg-navy-900">
      <div className="mx-auto max-w-[var(--container-max)] px-6">
        {aside ? (
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
            <div className="order-2 max-w-2xl md:order-1">{textContent}</div>
            <div className="order-1 flex-shrink-0 md:order-2">{aside}</div>
          </div>
        ) : (
          textContent
        )}
      </div>
    </section>
  );
}
