"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import ReactCrop, {
    centerCrop,
    convertToPixelCrop,
    makeAspectCrop,
    type PercentCrop,
    type PixelCrop,
} from "react-image-crop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Eye, EyeOff, Loader2, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { EditorFormProps } from "@/lib/types";
import type { ReactNode } from "react";

const PERSONAL_FIELDS = [
    { key: "firstName", label: "First Name", type: "text" },
    { key: "lastName", label: "Last Name", type: "text" },
] as const;

const CONTACT_FIELDS = [
    { key: "jobTitle", label: "Designation", type: "text" },
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "email", label: "Email", type: "email" },
] as const;

const LINK_FIELDS = [
    { key: "linkedin", label: "LinkedIn", type: "url" },
    { key: "website", label: "Website", type: "url" },
] as const;

const LINK_PLACEHOLDER_LABELS = {
    linkedin: "LinkedIn",
    website: "Website",
} as const;

const LINK_LABEL_MODE_KEYS = {
    linkedin: "linkLabelMode.linkedin",
    website: "linkLabelMode.website",
} as const;

type LinkFieldKey = (typeof LINK_FIELDS)[number]["key"];

const PHOTO_ASPECT_RATIO = 1;
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
): PercentCrop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 80,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

async function createCroppedImageBlob(
    image: HTMLImageElement,
    crop: PixelCrop,
): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;

    const cropWidth = Math.max(1, crop.width * scaleX);
    const cropHeight = Math.max(1, crop.height * scaleY);
    canvas.width = Math.max(1, Math.floor(cropWidth * pixelRatio));
    canvas.height = Math.max(1, Math.floor(cropHeight * pixelRatio));

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Canvas is not supported in this browser");
    }

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    // Save as a circular image so the stored output matches the crop UI.
    const radius = Math.min(cropWidth, cropHeight) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cropWidth / 2, cropHeight / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
    );
    ctx.restore();

    const outputMimeType = "image/png";

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Failed to generate cropped image"));
                    return;
                }
                resolve(blob);
            },
            outputMimeType,
            0.92,
        );
    });
}

function getCroppedFileName(file: File): string {
    const baseName = file.name.replace(/\.[^.]+$/, "") || "profile-photo";
    return `${baseName}-cropped.png`;
}

function FieldRow({
    fieldKey,
    label,
    type,
    value,
    isVisible,
    onValueChange,
    onVisibilityToggle,
    children,
}: {
    fieldKey: string;
    label: string;
    type: string;
    value: string | undefined;
    isVisible: boolean;
    onValueChange: (v: string) => void;
    onVisibilityToggle: () => void;
    children?: ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
                <Label htmlFor={fieldKey} className="text-sm font-medium">
                    {label}
                </Label>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={onVisibilityToggle}
                    title={isVisible ? "Hide in preview" : "Show in preview"}
                >
                    {isVisible ? (
                        <Eye className="h-3 w-3" />
                    ) : (
                        <EyeOff className="h-3 w-3" />
                    )}
                </Button>
            </div>
            <Input
                id={fieldKey}
                type={type}
                value={value ?? ""}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={label}
            />
            {children}
        </div>
    );
}

export default function PersonalInfoSection({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const fieldVisibility = resumeData.fieldVisibility ?? {};
    const [isUploading, setIsUploading] = useState(false);
    const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
    const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
    const [crop, setCrop] = useState<PercentCrop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cropImageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        return () => {
            if (cropImageUrl) URL.revokeObjectURL(cropImageUrl);
        };
    }, [cropImageUrl]);

    function resetCropState() {
        setCropDialogOpen(false);
        setSelectedPhotoFile(null);
        setCrop(undefined);
        setCompletedCrop(null);
        cropImageRef.current = null;
        setCropImageUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    }

    function handleCropDialogOpenChange(open: boolean) {
        if (isUploading) return;
        if (!open) {
            resetCropState();
            return;
        }
        setCropDialogOpen(true);
    }

    function onCropImageLoad(e: SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const initialCrop = centerAspectCrop(width, height, PHOTO_ASPECT_RATIO);
        setCrop(initialCrop);
        setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
    }

    async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
            toast.error("Please upload a JPG, PNG, or WebP image");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (file.size > MAX_PHOTO_SIZE_BYTES) {
            toast.error("Image is too large. Maximum size is 5MB");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setCropImageUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return objectUrl;
        });
        setSelectedPhotoFile(file);
        setCrop(undefined);
        setCompletedCrop(null);
        setCropDialogOpen(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleCropAndUpload() {
        if (!selectedPhotoFile || !cropImageRef.current || !completedCrop) {
            toast.error("Please select and crop an image before uploading");
            return;
        }

        if (!completedCrop.width || !completedCrop.height) {
            toast.error("Crop area is too small");
            return;
        }

        if (!resumeData.id) {
            toast.error("Resume ID is missing. Please refresh and try again.");
            return;
        }

        setIsUploading(true);
        try {
            const croppedImageBlob = await createCroppedImageBlob(
                cropImageRef.current,
                completedCrop,
            );
            const croppedFile = new File(
                [croppedImageBlob],
                getCroppedFileName(selectedPhotoFile),
                { type: croppedImageBlob.type || selectedPhotoFile.type },
            );

            const formData = new FormData();
            formData.append("file", croppedFile);
            formData.append("fileType", "photo");
            formData.append("resumeId", resumeData.id);

            const res = await fetch("/api/files/upload", {
                method: "POST",
                body: formData,
            });
            const data: {
                success?: boolean;
                url?: string;
                error?: string;
                resumePhotoSynced?: boolean;
            } = await res.json();

            if (!res.ok || !data.success || !data.url) {
                toast.error(data.error || "Failed to upload photo");
                return;
            }

            setResumeData((prev) => ({ ...prev, photoUrl: data.url }));
            if (data.resumePhotoSynced === false) {
                toast.error("Photo uploaded, but resume DB sync could not be verified");
            } else {
                toast.success("Photo uploaded successfully");
            }
            resetCropState();
        } catch (error) {
            console.error("Photo upload failed", error);
            toast.error("Failed to upload photo");
        } finally {
            setIsUploading(false);
        }
    }

    async function handlePhotoRemove() {
        if (!resumeData.photoUrl || isRemovingPhoto || isUploading) return;

        if (!resumeData.id) {
            setResumeData((prev) => ({ ...prev, photoUrl: undefined }));
            return;
        }

        setIsRemovingPhoto(true);
        try {
            const res = await fetch(
                `/api/files/upload?fileType=photo&resumeId=${encodeURIComponent(resumeData.id)}`,
                { method: "DELETE" },
            );
            const data: {
                success?: boolean;
                error?: string;
                resumePhotoCleared?: boolean;
            } = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.error || "Failed to delete photo");
                return;
            }

            setResumeData((prev) => ({ ...prev, photoUrl: undefined }));
            if (data.resumePhotoCleared === false) {
                toast.error("Photo deleted, but DB clear could not be verified");
            } else {
                toast.success("Photo removed");
            }
        } catch (error) {
            console.error("Photo delete failed", error);
            toast.error("Failed to delete photo");
        } finally {
            setIsRemovingPhoto(false);
        }
    }

    function updateField(key: keyof typeof resumeData, value: string) {
        setResumeData((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
    }

    function toggleVisibility(fieldName: string) {
        setResumeData((prev) => ({
            ...prev,
            fieldVisibility: {
                ...(prev.fieldVisibility ?? {}),
                [fieldName]: (prev.fieldVisibility?.[fieldName] ?? true)
                    ? false
                    : true,
            },
        }));
    }

    function isVisible(fieldName: string) {
        return fieldVisibility[fieldName] !== false;
    }

    function usesPlaceholderLabel(fieldName: LinkFieldKey) {
        return fieldVisibility[LINK_LABEL_MODE_KEYS[fieldName]] === true;
    }

    function setLinkDisplayMode(fieldName: LinkFieldKey, usePlaceholder: boolean) {
        setResumeData((prev) => ({
            ...prev,
            fieldVisibility: {
                ...(prev.fieldVisibility ?? {}),
                [LINK_LABEL_MODE_KEYS[fieldName]]: usePlaceholder,
            },
        }));
    }

    return (
        <div className="w-full min-w-0 max-w-full space-y-6">
            {/* Photo upload */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        type="button"
                        className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/50 transition-colors hover:border-primary/50"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isRemovingPhoto}
                    >
                        {resumeData.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={resumeData.photoUrl}
                                alt="Resume photo"
                                className="h-full w-full object-cover"
                            />
                        ) : isUploading || isRemovingPhoto ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                            <Camera className="h-6 w-6 text-muted-foreground" />
                        )}
                    </button>
                    {resumeData.photoUrl && !isUploading && !isRemovingPhoto && (
                        <button
                            type="button"
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
                            onClick={handlePhotoRemove}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Photo</p>
                    <p className="text-xs">JPG, PNG, or WebP. Max 5MB.</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoSelect}
                />
            </div>

            {/* Name fields */}
            <div className="grid gap-4">
                {PERSONAL_FIELDS.map(({ key, label, type }) => (
                    <FieldRow
                        key={key}
                        fieldKey={key}
                        label={label}
                        type={type}
                        value={resumeData[key] as string | undefined}
                        isVisible={isVisible(key)}
                        onValueChange={(v) => updateField(key, v)}
                        onVisibilityToggle={() => toggleVisibility(key)}
                    />
                ))}
            </div>

            {/* Contact fields */}
            <div className="grid gap-4">
                {CONTACT_FIELDS.map(({ key, label, type }) => (
                    <FieldRow
                        key={key}
                        fieldKey={key}
                        label={label}
                        type={type}
                        value={resumeData[key] as string | undefined}
                        isVisible={isVisible(key)}
                        onValueChange={(v) => updateField(key, v)}
                        onVisibilityToggle={() => toggleVisibility(key)}
                    />
                ))}
            </div>

            {/* Link fields */}
            <div className="grid gap-4">
                {LINK_FIELDS.map(({ key, label, type }) => (
                    <FieldRow
                        key={key}
                        fieldKey={key}
                        label={label}
                        type={type}
                        value={resumeData[key] as string | undefined}
                        isVisible={isVisible(key)}
                        onValueChange={(v) => updateField(key, v)}
                        onVisibilityToggle={() => toggleVisibility(key)}
                    >
                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                                Display in resume
                            </span>
                            <div className="inline-flex rounded-md border bg-muted/20 p-0.5">
                                <Button
                                    type="button"
                                    size="xs"
                                    variant={
                                        usesPlaceholderLabel(key)
                                            ? "ghost"
                                            : "secondary"
                                    }
                                    className="h-7"
                                    onClick={() =>
                                        setLinkDisplayMode(key, false)
                                    }
                                >
                                    Full URL
                                </Button>
                                <Button
                                    type="button"
                                    size="xs"
                                    variant={
                                        usesPlaceholderLabel(key)
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="h-7"
                                    onClick={() =>
                                        setLinkDisplayMode(key, true)
                                    }
                                >
                                    Label
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {usesPlaceholderLabel(key)
                                ? `Shows icon + "${LINK_PLACEHOLDER_LABELS[key]}"`
                                : "Shows icon + full URL"}
                        </p>
                    </FieldRow>
                ))}
            </div>

            <Dialog open={cropDialogOpen} onOpenChange={handleCropDialogOpenChange}>
                <DialogContent
                    showCloseButton={!isUploading}
                    className="w-[min(92vw,36rem)] max-w-none overflow-hidden p-0"
                >
                    <div className="grid max-h-[88vh] grid-rows-[auto_minmax(0,1fr)_auto]">
                        <DialogHeader className="border-b px-4 py-3">
                            <DialogTitle>Crop profile photo</DialogTitle>
                            <DialogDescription>
                                Adjust your image before uploading.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="min-h-0 bg-muted/30 p-3">
                            <div className="flex h-full min-h-[18rem] items-center justify-center overflow-hidden rounded-md border bg-background">
                                {cropImageUrl ? (
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(pixelCrop, percentCrop) => {
                                            setCrop(percentCrop);
                                            setCompletedCrop(pixelCrop);
                                        }}
                                        aspect={PHOTO_ASPECT_RATIO}
                                        circularCrop
                                        keepSelection
                                        minWidth={120}
                                        minHeight={120}
                                        className="max-h-full max-w-full"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            ref={cropImageRef}
                                            src={cropImageUrl}
                                            alt="Crop preview"
                                            onLoad={onCropImageLoad}
                                            className="block max-h-[52vh] w-auto max-w-full"
                                        />
                                    </ReactCrop>
                                ) : null}
                            </div>
                        </div>

                        <DialogFooter className="border-t px-4 py-3 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetCropState}
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCropAndUpload}
                                disabled={
                                    isUploading ||
                                    !selectedPhotoFile ||
                                    !completedCrop?.width ||
                                    !completedCrop?.height
                                }
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    "Crop & Upload"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
