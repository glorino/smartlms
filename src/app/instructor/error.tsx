"use client";

export default function InstructorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900">Instructor Error</h2>
        <p className="mt-2 text-gray-600">
          Something went wrong in the instructor dashboard.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
