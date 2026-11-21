export default function Loading() {
  return (
    <div className="min-h-[70vh] grid place-items-center pt-[120px]" role="status" aria-label="Loading">
      <span className="w-8 h-8 rounded-full border-2 border-fg/15 border-t-warm animate-spin" />
    </div>
  );
}
