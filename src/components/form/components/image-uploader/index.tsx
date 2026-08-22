import { DropZone } from './drop-zone'
import { ImageList } from './image-list'
import { HiddenInputs } from './hidden-inputs'
import { useImageUploader } from '../../../../hooks/use-image-uploader'
import Carousel from './carrousel'
import { User } from 'lucide-react'

import type { ImageField } from '../../../../types/form'
import type { RefObject } from 'react'

export default function ImageUploader({
    options,
    value,
    readOnly,
    avatarMode
}: ImageField) {

    const {
        maxFiles = avatarMode ? 1 : 5,
        maxFileSize = 5 * 1024 * 1024,
        preferred = {
            enabled: false
        }
    } = options || {}

    const defaultValue: { values: string | { path: string; id: number; }[]; preferred: string } = { values: [] as { path: string; id: number; }[], preferred: '' };
    
    const {
        images,
        externalImages,
        preferredImageName,
        dragActive,
        carouselOpen,
        carouselIndex,
        isLimitReached,
        isSingleImage,
        handlers,
        fileInputRef,
        removedExternalImages
    } = useImageUploader({
        maxFiles: avatarMode ? 1 : maxFiles,
        maxFileSize,
        value: (value as { values: string | { path: string; id: number; }[]; preferred: string } | undefined) ?? defaultValue,
        readOnly
    })

    const allImages = [
        ...externalImages.map(img => ({
            ...img,
            preview: img.url
        })),
        ...images
    ]

    if (avatarMode) {
        const avatarPreview = allImages.length > 0 ? allImages[0].preview : null

        return (
            <div className="w-full flex flex-col items-center gap-3">
                <HiddenInputs
                    removedExternalImages={removedExternalImages}
                    images={images}
                    preferred={{
                        enabled: preferred.enabled,
                        ...(preferredImageName ? { id: preferredImageName } : {})
                    }}
                />
                <div
                    className="relative w-28 h-28 rounded-full border-2 border-dashed border-border/60 bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
                    onClick={() => {
                        if (!readOnly && fileInputRef.current) {
                            (fileInputRef.current as HTMLInputElement).click()
                        }
                    }}
                >
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Profile photo"
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <User className="w-10 h-10 text-muted-foreground/50 group-hover:text-primary/60 transition-colors" />
                    )}
                </div>
                {!readOnly && (
                    <>
                        <input
                            ref={fileInputRef as RefObject<HTMLInputElement>}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlers.handleFiles}
                        />
                        <button
                            type="button"
                            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    (fileInputRef.current as HTMLInputElement).click()
                                }
                            }}
                        >
                            {avatarPreview ? 'Change photo' : 'Upload photo'}
                        </button>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <HiddenInputs
                removedExternalImages={removedExternalImages}
                images={images}
                preferred={{
                    enabled: preferred.enabled,
                    ...(preferredImageName ? { id: preferredImageName } : {})
                }}
            />
            {!readOnly && (
                <DropZone
                    fileInputRef={fileInputRef as RefObject<HTMLInputElement>}
                    isLimitReached={isLimitReached}
                    isSingleImage={isSingleImage}
                    dragActive={dragActive}
                    maxFileSize={maxFileSize}
                    handlers={handlers}
                >
                    {<p className="mt-2 text-sm text-gray-600">
                        {allImages.length} / {maxFiles} images uploaded
                    </p>}
                </DropZone>
            )}
            <ImageList
                images={allImages}
                preferred={preferred}
                {...(preferredImageName ? { preferredImageName } : {})}
                {...(readOnly !== undefined ? { readOnly } : {})}
                handlers={handlers}
            />
            {carouselOpen && (
                <Carousel
                    images={allImages}
                    onClose={handlers.closeCarousel}
                    initialIndex={carouselIndex}
                />
            )}
        </div>
    )
}

