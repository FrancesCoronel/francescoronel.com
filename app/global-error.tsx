"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center font-sans">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
          Something went wrong
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Unexpected Error
        </h1>
        <p className="mt-3 max-w-sm text-gray-500">
          An error occurred while loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-orange-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-800"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
