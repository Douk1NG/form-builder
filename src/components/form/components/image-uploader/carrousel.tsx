import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import { useCarousel } from '../../../../hooks/use-carrousel'
import type { CarouselProps } from '../../../../types/image-uploader'

export default function Carousel({
    images,
    onClose,
    initialIndex
}: CarouselProps) {

    const {
        currentIndex,
        isSingleImage,
        goToPrevious,
        goToNext,
        imageUrl,
        imageName
    } = useCarousel(images, onClose, initialIndex)

    return (
        <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 z-10 cursor-pointer"
                    type="button"
                    aria-label="Close gallery"
                    title="Close gallery"
                >
                    <X className="h-6 w-6 text-white md:h-8 md:w-8" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div
                        className="relative w-full h-full max-h-[90vh]"
                        onClick={onClose}
                        title="Close gallery"
                    >
                        {imageUrl && (
                            <img
                                onClick={(e) => e.stopPropagation()}
                                src={imageUrl}
                                alt={`${imageName}`}
                                className="object-contain rounded-sm w-full h-full max-h-[90vh] m-auto"
                                title={imageName}
                                loading="lazy"
                            />
                        )}
                    </div>
                </div>

                {!isSingleImage && (
                    <>
                        <button
                            type="button"
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 cursor-pointer"
                            aria-label="Previous image"
                            title="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6 text-white md:h-8 md:w-8" />
                        </button>
                        <button
                            type="button"
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 cursor-pointer"
                            aria-label="Next image"
                            title="Next image"
                        >
                            <ChevronRight className="h-6 w-6 text-white md:h-8 md:w-8" />
                        </button>
                    </>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                    <p className="text-white text-sm select-none" role="status">
                        {currentIndex + 1} / {images.length}
                    </p>
                </div>
            </div>
        </div>
    )
}

