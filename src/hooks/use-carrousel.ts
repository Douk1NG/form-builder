import { useState, useEffect } from "react"
import type { CarouselImage } from '../types/image-uploader'

export function useCarousel(images: CarouselImage[], onClose: () => void, initialIndex: number) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const isSingleImage = images.length === 1

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose()
                    break
                case 'ArrowLeft':
                    if (!isSingleImage) goToPrevious()
                    break
                case 'ArrowRight':
                    if (!isSingleImage) goToNext()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isSingleImage, goToPrevious, goToNext, onClose])

    const currentImage = images[currentIndex]
    const imageUrl = currentImage && 'preview' in currentImage ? currentImage.preview : currentImage?.url
    const imageName = currentImage?.name

    return {
        currentIndex,
        isSingleImage,
        goToPrevious,
        goToNext,
        currentImage,
        imageUrl,
        imageName
    }
}