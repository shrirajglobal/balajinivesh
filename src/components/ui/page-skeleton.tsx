import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => (
  <div className="container py-8 lg:py-12">
    <Skeleton className="h-10 w-64 mb-2" />
    <Skeleton className="h-5 w-96 mb-8" />
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl border border-border p-6">
          <Skeleton className="h-12 w-12 rounded-lg mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-1" />
        </div>
      ))}
    </div>
  </div>
);

export default PageSkeleton;
