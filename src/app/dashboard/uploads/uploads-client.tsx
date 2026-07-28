"use client";

import { useState } from "react";
import { FileRow } from "./file-row";
import { AnalysisDrawer } from "./analysis-drawer";

interface FileWithUrl {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    createdAt: Date | null;
}

export function UploadsClient({ files }: { files: FileWithUrl[] }) {
    const [analysisFileId, setAnalysisFileId] = useState<string | null>(null);
    const [analysisFileName, setAnalysisFileName] = useState<string | null>(
        null,
    );
    const [drawerOpen, setDrawerOpen] = useState(false);

    function handleAnalyze(fileId: string, fileName: string) {
        setAnalysisFileId(fileId);
        setAnalysisFileName(fileName);
        setDrawerOpen(true);
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                {files.map((file) => (
                    <FileRow
                        key={file.id}
                        file={file}
                        onAnalyze={handleAnalyze}
                    />
                ))}
            </div>

            <AnalysisDrawer
                fileId={analysisFileId}
                fileName={analysisFileName}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            />
        </>
    );
}
