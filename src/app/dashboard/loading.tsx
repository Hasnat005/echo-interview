export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-slate-900">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <p className="text-sm font-medium text-slate-700">Loading dashboard...</p>
      </div>
    </div>
  );
}
