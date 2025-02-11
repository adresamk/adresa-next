export function ListingsLoadingSkeleton() {
  return (
    <div className="w-full animate-pulse p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
