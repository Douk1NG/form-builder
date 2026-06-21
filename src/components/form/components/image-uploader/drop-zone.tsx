import { formatFileSize } from '../../../../utils/file'
import { Button } from '../../../ui/button'
import { Upload } from "lucide-react"

import type { DropZoneProps } from '../../../../types/image-uploader'

export const DropZone = ({
    isLimitReached,
    isSingleImage,
    dragActive,
    maxFileSize,
    handlers,
    fileInputRef,
    children
}: DropZoneProps) => {

    const handleOpenFileDialog = () => {
        if (isLimitReached) {
            return
        }
        fileInputRef.current?.click()
    }

    return (
        <div
            className={`p-4 border-2 border-dashed rounded-lg
                ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}
                ${isSingleImage ? "hidden" : ""}
                ${isLimitReached ? "opacity-50 cursor-not-allowed" : ""}`
            }
            onDragEnter={handlers.drag}
            onDragLeave={handlers.drag}
            onDragOver={handlers.drag}
            onDrop={handlers.drop}
            onClick={handleOpenFileDialog}
            role="button"
            tabIndex={0}
            aria-label="Upload images"
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handlers.change}
                accept="image/*"
                className="hidden"
            />
            <div className={`text-center ${isLimitReached ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                <Upload
                    className="mx-auto text-gray-400 w-10 h-10"
                />
                <p className="mt-2 text-sm text-gray-600">
                    Drag and drop images here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    {`PNG, JPG, AVIF, WEBP up to ${formatFileSize(maxFileSize)}`}
                </p>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleOpenFileDialog()
                    }}
                    disabled={isLimitReached}
                    className={`mt-2 ${isLimitReached ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}`}
                >
                    Select files
                </Button>
                {children}
                {isLimitReached && (
                    <p className="mt-2 text-sm text-red-500">
                        Maximum number of files reached
                    </p>
                )}
            </div>
        </div>
    )
}
