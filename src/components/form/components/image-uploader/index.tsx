import { DropZone } from './drop-zone'
import { ImageList } from './image-list'
import { HiddenInputs } from './hidden-inputs'
import { useImageUploader } from '../../../../hooks/use-image-uploader'
import Carousel from './carrousel'

import type { ImageField } from '../../../../types/form'
import type { RefObject } from 'react'

export default function ImageUploader({
    options,
    value,
    readOnly
}: ImageField) {

    const {
        maxFiles = 5,
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
        maxFiles,
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
