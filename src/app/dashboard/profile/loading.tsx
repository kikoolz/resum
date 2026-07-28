import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-5 w-80" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* User Info Card skeleton */}
                <div className="md:col-span-2 rounded-xl border p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-44" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex gap-6 items-start">
                        <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-7 w-40" />
                            <Skeleton className="h-4 w-52" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-28 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Card skeleton */}
                <div className="rounded-xl border p-6 shadow-sm space-y-4">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-4 w-36" />
                    <div className="rounded-lg border p-4 space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
            </div>

            <div className="flex justify-center py-4">
                <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
        </div>
    );
}
