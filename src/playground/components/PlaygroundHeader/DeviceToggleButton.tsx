import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DeviceToggleOption } from '@/playground/utils/deviceToggleOptions'
import type { PreviewDevice } from '@/playground/utils/previewFrameConfig'

const deviceIcons = {
    Monitor,
    Tablet,
    Smartphone,
}

export type DeviceToggleButtonProps = {
    device: PreviewDevice
    activeDevice: PreviewDevice
    iconName: DeviceToggleOption['iconName']
    onSelect: (device: PreviewDevice) => void
}

export function DeviceToggleButton({
    device,
    activeDevice,
    iconName,
    onSelect
}: DeviceToggleButtonProps) {
    const isActive = device === activeDevice
    const IconComponent = deviceIcons[iconName]

    return (
        <Button
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onSelect(device)}
            className="h-7 w-8 px-0"
        >
            <IconComponent className="h-4 w-4" />
        </Button>
    )
}