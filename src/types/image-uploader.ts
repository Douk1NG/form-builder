export type ImageFile = File & {
    preview: string
}

export type ExternalImage = {
    url: string
    name: string
}

type preferred = {
    enabled: boolean
    id?: string
}

export type ImageUploaderHandlers = {
    files: (files: FileList) => void
    drag: (e: React.DragEvent<HTMLDivElement>) => void
    drop: (e: React.DragEvent<HTMLDivElement>) => void
    change: (e: React.ChangeEvent<HTMLInputElement>) => void
    removeImage: (name: string, external?: boolean) => void
    setPreferred: (name: string) => void
    openCarousel: (index: number) => void
    closeCarousel: () => void
}

export type ImageCardProps = {
    image: ImageFile | ExternalImage;
    preferred: preferred;
    preferredImageName?: string;
    readOnly?: boolean;
    handlers: {
        openCarousel: (index: number) => void;
        removeImage: (name: string, isExternal?: boolean) => void;
        setPreferred: (name: string) => void;
    };
    index: number;
}

export type UseImageUploaderProps = {
    maxFiles: number
    maxFileSize: number
    value?: {
        values: {
            path: string
            id: number
        }[] | string
        preferred: string
    }
    readOnly?: boolean
}

export type ImageUploaderProps = {
    options?: {
        maxFiles?: number
        maxFileSize?: number
        preferred?: preferred
    }
}

export type ImageListProps = {
    images: (ImageFile | ExternalImage)[]
    preferred: preferred
    preferredImageName?: string
    readOnly?: boolean
    handlers: {
        removeImage: (name: string, external?: boolean) => void
        setPreferred: (name: string) => void
        openCarousel: (index: number) => void
    }
}

export type HiddenInputsProps = {
    images: (ImageFile | ExternalImage)[]
    removedExternalImages: string[]
    preferred: preferred
}

export type DropZoneProps = {
    isLimitReached: boolean
    isSingleImage: boolean
    dragActive: boolean
    maxFileSize: number
    handlers: {
        drag: (e: React.DragEvent<HTMLDivElement>) => void
        drop: (e: React.DragEvent<HTMLDivElement>) => void
        change: (e: React.ChangeEvent<HTMLInputElement>) => void
    }
    fileInputRef: React.RefObject<HTMLInputElement>
    children?: React.ReactNode
}

export type CarouselImage = ImageFile | ExternalImage

export type CarouselProps = {
    images: CarouselImage[]
    onClose: () => void
    initialIndex: number
}
