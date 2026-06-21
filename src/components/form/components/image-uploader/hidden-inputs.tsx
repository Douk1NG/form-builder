import type { HiddenInputsProps } from '../../../../types/image-uploader'

export const HiddenInputs = ({
    images,
    removedExternalImages,
    preferred
}: HiddenInputsProps) => {
    const uploadedImages = images.filter((image) => image instanceof File)

    return (
        <>
            {uploadedImages.map((file) => (
                <input
                    key={file.name}
                    type="file"
                    name="images"
                    className="hidden"
                    ref={(element) => {
                        if (element) {
                            const dataTransfer = new DataTransfer()
                            dataTransfer.items.add(file)
                            element.files = dataTransfer.files
                        }
                    }}
                />
            ))}
            {preferred.enabled && preferred.id && (
                <input
                    type="hidden"
                    name="images_preferred"
                    value={preferred.id}
                />
            )}
            {removedExternalImages.map((name) => (
                <input
                    key={`removed-${name}`}
                    type="hidden"
                    name="images_removed"
                    value={name}
                />
            ))}
        </>
    )
}
