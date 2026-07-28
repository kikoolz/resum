import { Spinner } from "@/components/ui/spinner";

export default function EditorLoading() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Spinner className="h-8 w-8 text-primary" />
                <p className="text-sm text-muted-foreground">
                    Loading editor...
                </p>
            </div>
        </div>
    );
}
