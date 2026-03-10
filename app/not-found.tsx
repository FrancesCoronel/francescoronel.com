import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-navy-900 dark:text-horchata-100">
        404
      </h1>
      <p className="mt-4 text-lg text-navy-600 dark:text-white/70">
        This page doesn&apos;t exist. Maybe it was moved or you typed the URL
        wrong?
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-horchata-700 px-6 py-3 text-sm font-medium text-white hover:bg-horchata-800 dark:bg-horchata-500 dark:text-navy-900 dark:hover:bg-horchata-400"
      >
        Go Home
      </Link>
    </div>
  );
}
