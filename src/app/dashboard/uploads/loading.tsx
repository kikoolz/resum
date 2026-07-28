import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function UploadsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-5 w-72" />
            </div>

            {/* Upload area skeleton */}
            <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-8 w-28 rounded-md" />
            </div>

            {/* File list skeleton */}
            <div className="mt-8 space-y-3">
                <Skeleton className="h-6 w-24" />
                <div className="divide-y rounded-lg border">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3">
                            <Skeleton className="h-8 w-8 shrink-0 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex gap-1">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
        </div>
    );
}
