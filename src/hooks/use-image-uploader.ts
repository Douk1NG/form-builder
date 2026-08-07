import { useState, useCallback, useRef } from "react"
import { isValidFileType } from '../utils/file'
import type { UseImageUploaderProps, ImageFile, ExternalImage } from '../types/image-uploader'

const getExternalImages = (images: UseImageUploaderProps['value']) => {
    if(!images) return []

    if(typeof images === 'string') {
        return [{
            url: images,
            name: images
        }]
    }

    if (images?.values.length && Array.isArray(images?.values)) {
        return images.values.map((item) => ({
            url: item.path,
            name: item.path,
            id: item.id
        }))
    }
    return []
}

const mergeImages = (previousImages: ImageFile[], newImages: ImageFile[], maximumFiles: number): ImageFile[] => {
    const newImageNames = new Set(newImages.map((image) => image.name))
    return [
        ...previousImages.filter((previousImage) => !newImageNames.has(previousImage.name)),
        ...newImages
    ].slice(0, maximumFiles)
}

export const useImageUploader = ({
    maxFiles,
    maxFileSize,
    value,
    readOnly
}: UseImageUploaderProps) => {
    const [images, setImages] = useState<ImageFile[]>([])
    const [externalImages, setExternalImages] = useState<ExternalImage[]>(getExternalImages(value))
    const [removedExternalImages, setRemovedExternalImages] = useState<string[]>([])

    const [preferredImageName, setPreferredImageName] = useState(value?.preferred)
    const [dragActive, setDragActive] = useState(false)
    const [carouselOpen, setCarouselOpen] = useState(false)
    const [carouselIndex, setCarouselIndex] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const isLimitReached = (images.length + externalImages.length) >= maxFiles
    const isSingleImage = Boolean((images.length + externalImages.length) && maxFiles === 1)

    const handleFiles = useCallback(
        (files: FileList) => {
            if (isLimitReached) return

            const validFiles = Array.from(files).filter((file) =>
                isValidFileType(file) && file.size <= maxFileSize
            )

            const newImages = validFiles.map((file) => {
                return Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            })

            setImages((previousImages) =>
                mergeImages(previousImages, newImages, maxFiles)
            )

            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }

            if (!preferredImageName && newImages.length > 0) {
                setPreferredImageName(newImages[0]?.name)
            }
        },
        [isLimitReached, maxFileSize, maxFiles, preferredImageName],
    )

    const removeExternalImage = useCallback((name: string) => {
        if (readOnly) return
        setExternalImages(prev => prev.filter(img => img.name !== name))
        setRemovedExternalImages(prev => [...prev, name])
        if (preferredImageName === name) {
            setPreferredImageName(undefined)
        }
    }, [readOnly, preferredImageName])

    const handlers = {
        files: handleFiles,
        drag: useCallback((e: React.DragEvent<HTMLDivElement>) => {
            if (isLimitReached) return
            e.preventDefault()
            e.stopPropagation()
            if (e.type === "dragenter" || e.type === "dragover") {
                setDragActive(true)
            } else if (e.type === "dragleave") {
                setDragActive(false)
            }
        }, [isLimitReached]),
        drop: useCallback((e: React.DragEvent<HTMLDivElement>) => {
            if (isLimitReached) return
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFiles(e.dataTransfer.files)
            }
        }, [handleFiles, isLimitReached]),
        change: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault()
            if (e.target.files && e.target.files[0]) {
                handleFiles(e.target.files)
            }
        }, [handleFiles]),
        removeImage: useCallback((name: string, external?: boolean) => {
            if (readOnly) return

            if (preferredImageName === name) {
                setPreferredImageName(undefined)
            }

            if (external) {
                removeExternalImage(name)
                return
            }

            setImages((prevImages) =>
                prevImages.filter((image) => image.name !== name)
            )

        }, [readOnly, removeExternalImage, preferredImageName]),
        setPreferred: useCallback((name: string) => {
            setPreferredImageName(name)
        }, []),
        openCarousel: useCallback((index: number) => {
            setCarouselIndex(index)
            setCarouselOpen(true)
        }, []),
        closeCarousel: useCallback(() => {
            setCarouselOpen(false)
        }, [])
    }

    return {
        images,
        externalImages,
        removedExternalImages,
        preferredImageName,
        dragActive,
        carouselOpen,
        carouselIndex,
        isLimitReached,
        isSingleImage,
        readOnly,
        fileInputRef,
        handlers
    }
}
