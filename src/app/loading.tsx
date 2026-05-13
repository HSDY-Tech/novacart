import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="container py-10">
      <Skeleton className="mb-8 h-8 w-56" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-80" />)}
      </div>
    </div>
  );
}
