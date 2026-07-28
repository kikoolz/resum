import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header skeleton */}
            <div className="mb-8 flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-4 rounded-xl border p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Center spinner overlay */}
            <div className="mt-8 flex justify-center">
                <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
        </div>
    );
}
