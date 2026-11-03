function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <span
      className={`block animate-pulse rounded bg-[var(--theme-border)] motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  )
}

export function ReportLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading report</span>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="!text-3xl font-semibold">Report</h1>
          <SkeletonLine className="h-4 w-64 max-w-full" />
        </div>
        <div className="flex gap-2" aria-hidden="true">
          <SkeletonLine className="h-11 w-24 rounded-lg" />
          <SkeletonLine className="h-11 w-32 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="authdesk-glass-card break-inside-avoid space-y-3 rounded-[20px] p-5 sm:p-6"
            aria-hidden="true"
          >
            <SkeletonLine className="h-7 w-7 rounded-lg" />
            <SkeletonLine className="h-3 w-20" />
            <SkeletonLine className="h-5 w-28 max-w-full" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="authdesk-glass-card break-inside-avoid space-y-4 rounded-[20px] p-5 sm:p-6"
          >
            <SkeletonLine className="h-5 w-32" />
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-4/5" />
            <SkeletonLine className="h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}
