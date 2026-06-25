import type { PreviewDevice } from './previewFrameConfig'

export type DeviceToggleOption = {
    device: PreviewDevice
    iconName: 'Monitor' | 'Tablet' | 'Smartphone'
}

export const deviceToggleOptions: DeviceToggleOption[] = [
    { device: 'desktop', iconName: 'Monitor' },
    { device: 'tablet', iconName: 'Tablet' },
    { device: 'mobile', iconName: 'Smartphone' },
]