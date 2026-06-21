import { X } from 'lucide-react';

import { formatFileSize } from '../../../../utils/file'
import { Button } from '../../../ui/button'
import { Star} from 'lucide-react';

import Image from "next/image"

import type {
    ImageCardProps,
    ImageListProps,
    ImageFile,
    ExternalImage
} from '../../../../types/image-uploader'

import { cn } from '../../../../lib/utils'

const ImageCard = ({
    image,
    preferred,
    preferredImageName,
    readOnly,
    handlers,
    index
}: ImageCardProps) => {
    const {
        url,
        preview,
        name,
        size
    } = image as ImageFile & ExternalImage

    const isExternal = 'url' in image

    return (
        <div key={name} className="relative h-[30vh] w-full">
            <Image
                src={url || preview}
                alt={url || name}
                className="object-cover rounded-md cursor-pointer"
                onClick={() => handlers.openCarousel(index)}
                title="View image"
                loading="lazy"
                priority={false}
                fill
            />
            {!readOnly && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlers.removeImage(name, isExternal)}
                    title="Remove image"
                    className="cursor-pointer absolute top-0 right-0 rounded-full"
                    type="button"
                >
                    <X className="h-5 w-5" />
                </Button>
            )}
            {preferred.enabled && !readOnly && (
                <button
                    type="button"
                    onClick={() => handlers.setPreferred(name)}
                    title="Set as preferred image"
                    className={`cursor-pointer absolute bottom-0 right-0 mb-1 mr-1 rounded-full p-1
                        ${preferredImageName === name ? "bg-yellow-500" : "bg-gray-200"}`}
                >
                    <Star
                        className={cn(
                            "h-8 w-8",
                            preferredImageName === name ? "text-white" : "text-gray-600"
                        )}
                    />
                </button>
            )}
            {!isExternal && (
                <p className="mt-1 text-xs text-gray-500 truncate">
                    {`${formatFileSize(size)} - ${name}`}
                </p>
            )}
        </div>
    )
}

export const ImageList = ({
    images,
    preferred,
    preferredImageName,
    readOnly,
    handlers
}: ImageListProps) => {
    if (images.length === 0) return null

    return (
        <div className="mt-4 grid grid-cols-2 gap-4">
            {images.map((image, index) => (
                <ImageCard
                    key={image.name}
                    image={image}
                    preferred={preferred}
                    {...(preferredImageName ? { preferredImageName } : {})}
                    {...(readOnly !== undefined ? { readOnly } : {})}
                    handlers={handlers}
                    index={index}
                />
            ))}
        </div>
    )
}
