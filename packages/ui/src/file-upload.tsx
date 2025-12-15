"use client";

import * as React from "react";
import clsx from "clsx";
import { UploadCloud, X, File, Image, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { Progress } from "./progress";

export interface FileUploadFile {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface FileUploadProps {
  onUpload?: (files: File[]) => void | Promise<void>;
  onFileChange?: (files: FileUploadFile[]) => void;
  accept?: string | string[];
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  showProgress?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const getFileIcon = (file: File): React.ReactNode => {
  if (file.type.startsWith("image/")) {
    return <Image className="h-5 w-5" />;
  }
  return <FileText className="h-5 w-5" />;
};

export const FileUpload = React.memo(
  React.forwardRef<HTMLDivElement, FileUploadProps>(
    function FileUpload(
    {
      onUpload,
      onFileChange,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      disabled = false,
      className,
      showPreview = true,
      showProgress = false,
      ...props
    },
    ref
  ) {
    const [files, setFiles] = React.useState<FileUploadFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [errors, setErrors] = React.useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const dropZoneRef = React.useRef<HTMLDivElement>(null);

    const acceptString = React.useMemo(() => {
      if (!accept) return undefined;
      if (Array.isArray(accept)) return accept.join(",");
      return accept;
    }, [accept]);

    const validateFile = React.useCallback(
      (file: File): string | null => {
        // Check file size
        if (maxSize && file.size > maxSize) {
          return `File size exceeds maximum of ${formatFileSize(maxSize)}`;
        }

        // Check file type
        if (acceptString) {
          const acceptedTypes = acceptString.split(",").map((t) => t.trim());
          const fileType = file.type;
          const fileName = file.name.toLowerCase();

          const isAccepted = acceptedTypes.some((type) => {
            if (type.startsWith(".")) {
              // Extension check
              return fileName.endsWith(type.toLowerCase());
            }
            // MIME type check
            if (type.endsWith("/*")) {
              return fileType.startsWith(type.slice(0, -2));
            }
            return fileType === type;
          });

          if (!isAccepted) {
            return `File type not accepted. Accepted types: ${acceptString}`;
          }
        }

        return null;
      },
      [maxSize, acceptString]
    );

    const processFiles = React.useCallback(
      (newFiles: FileList | File[]) => {
        const fileArray = Array.from(newFiles);
        const newErrors: string[] = [];

        // Check max files limit
        if (maxFiles && files.length + fileArray.length > maxFiles) {
          newErrors.push(`Maximum ${maxFiles} file(s) allowed`);
          setErrors(newErrors);
          return;
        }

        const processedFiles: FileUploadFile[] = [];

        fileArray.forEach((file) => {
          const error = validateFile(file);
          if (error) {
            newErrors.push(`${file.name}: ${error}`);
            return;
          }

          const fileId = `${file.name}-${file.size}-${Date.now()}`;
          const fileData: FileUploadFile = {
            file,
            id: fileId,
            progress: showProgress ? 0 : undefined,
          };

          // Generate preview for images
          if (showPreview && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileId ? { ...f, preview: e.target?.result as string } : f
                )
              );
            };
            reader.readAsDataURL(file);
          }

          processedFiles.push(fileData);
        });

        if (newErrors.length > 0) {
          setErrors(newErrors);
        }

        if (processedFiles.length > 0) {
          const updatedFiles = [...files, ...processedFiles];
          setFiles(updatedFiles);
          onFileChange?.(updatedFiles);

          // Call onUpload if provided
          if (onUpload) {
            const uploadPromise = onUpload(processedFiles.map((f) => f.file));
            if (uploadPromise && showProgress) {
              // Simulate progress if onUpload returns a promise
              processedFiles.forEach((fileData) => {
                let progress = 0;
                const interval = setInterval(() => {
                  progress += 10;
                  if (progress >= 100) {
                    clearInterval(interval);
                    setFiles((prev) =>
                      prev.map((f) =>
                        f.id === fileData.id ? { ...f, progress: 100 } : f
                      )
                    );
                  } else {
                    setFiles((prev) =>
                      prev.map((f) =>
                        f.id === fileData.id ? { ...f, progress } : f
                      )
                    );
                  }
                }, 100);

                uploadPromise
                  .then(() => {
                    clearInterval(interval);
                    setFiles((prev) =>
                      prev.map((f) =>
                        f.id === fileData.id ? { ...f, progress: 100 } : f
                      )
                    );
                  })
                  .catch((error) => {
                    clearInterval(interval);
                    setFiles((prev) =>
                      prev.map((f) =>
                        f.id === fileData.id
                          ? { ...f, error: error.message || "Upload failed" }
                          : f
                      )
                    );
                  });
              });
            }
          }
        }
      },
      [files, maxFiles, validateFile, showPreview, showProgress, onUpload, onFileChange]
    );

    const handleDragOver = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
          setIsDragging(true);
        }
      },
      [disabled]
    );

    const handleDragLeave = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      },
      []
    );

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
          if (!multiple && droppedFiles.length > 1) {
            setErrors(["Only one file allowed"]);
            return;
          }
          processFiles(droppedFiles);
        }
      },
      [disabled, multiple, processFiles]
    );

    const handleFileInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
          if (!multiple && selectedFiles.length > 1) {
            setErrors(["Only one file allowed"]);
            return;
          }
          processFiles(selectedFiles);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      [multiple, processFiles]
    );

    const handleRemoveFile = React.useCallback(
      (fileId: string) => {
        setFiles((prev) => {
          const updated = prev.filter((f) => f.id !== fileId);
          onFileChange?.(updated);
          return updated;
        });
      },
      [onFileChange]
    );

    const handleClick = React.useCallback(() => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, [disabled]);

    return (
      <div ref={ref} className={clsx("w-full", className)} {...props}>
        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={clsx(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-[color:var(--color-fg-muted)] bg-[color:var(--color-surface-2)]"
              : "border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)] hover:border-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-surface-2)]",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="File upload drop zone"
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptString}
            multiple={multiple}
            disabled={disabled}
            onChange={handleFileInputChange}
            className="hidden"
            aria-label="File input"
          />
          <UploadCloud
            className={clsx(
              "mx-auto h-12 w-12 mb-4",
              "text-[color:var(--color-fg-muted)]"
            )}
          />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-fg-muted)" }}>
            {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs" style={{ color: "var(--color-fg-muted)" }}>
            {acceptString && `Accepted: ${acceptString}`}
            {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
            {maxFiles && ` • Max files: ${maxFiles}`}
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mt-4 p-3 rounded-md bg-[color:var(--color-status-error-bg)] border border-[color:var(--color-status-error-border)]">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-[color:var(--color-status-error-fg)]">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((fileData) => (
              <div
                key={fileData.id}
                className="flex items-center gap-3 p-3 rounded-md border border-[color:var(--color-border-base)] bg-[color:var(--color-surface-1)]"
              >
                {/* Preview or Icon */}
                {showPreview && fileData.preview ? (
                  <img
                    src={fileData.preview}
                    alt={fileData.file.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center rounded bg-[color:var(--color-surface-2)]">
                    {getFileIcon(fileData.file)}
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[color:var(--color-fg-base)] truncate">
                    {fileData.file.name}
                  </p>
                  <p className="text-xs text-[color:var(--color-fg-muted)]">
                    {formatFileSize(fileData.file.size)}
                  </p>
                  {fileData.error && (
                    <p className="text-xs text-[color:var(--color-status-error-fg)] mt-1">
                      {fileData.error}
                    </p>
                  )}
                  {showProgress && fileData.progress !== undefined && (
                    <div className="mt-2">
                      <Progress value={fileData.progress} className="h-1" />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                {!fileData.error && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(fileData.id);
                    }}
                    disabled={disabled}
                    aria-label={`Remove ${fileData.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {fileData.error && (
                  <AlertCircle className="h-5 w-5 text-[color:var(--color-status-error-fg)] flex-shrink-0" />
                )}
                {fileData.progress === 100 && !fileData.error && (
                  <CheckCircle2 className="h-5 w-5 text-[color:var(--color-status-success-fg)] flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  )
);

FileUpload.displayName = "FileUpload";

