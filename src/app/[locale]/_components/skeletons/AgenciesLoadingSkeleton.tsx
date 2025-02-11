export function AgenciesLoadingSkeleton() {
  return (
    <div className="w-full animate-pulse p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
