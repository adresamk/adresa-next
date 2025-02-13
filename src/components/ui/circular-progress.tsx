export default function CircularProgress({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-[80px] w-[80px]">
        <svg
          className="absolute left-0 top-0 h-full w-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="url(#progress-gradient)"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - percentage / 100)}
          />
          <defs>
            <linearGradient
              id="progress-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform font-bold text-gray-900 dark:text-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="active:rotate-360 hover:rotate-6"
            src="/assets/adresa-logo-small.svg"
            width={33}
            height={33}
            alt="adresa logo"
          />
        </div>
      </div>
    </div>
  );
}
