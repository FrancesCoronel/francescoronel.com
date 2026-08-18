"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-horchata-600 dark:text-horchata-500">
        Something went wrong
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 dark:text-horchata-100">
        Unexpected Error
      </h1>
      <p className="mt-3 max-w-sm text-navy-500 dark:text-white/50">
        An error occurred while loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-horchata-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
      >
        Try again
      </button>
    </div>
  );
}
