import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8 space-y-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-5 w-72" />
            </div>

            {/* Current Plan Card skeleton */}
            <div className="mb-8 rounded-xl border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-36" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4 space-y-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center py-4">
                <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
        </div>
    );
}
