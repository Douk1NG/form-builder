import type { StateCreator } from 'zustand'
import type { FormBuilderState } from '../useFormBuilderStore'

export type BuilderUiSlice = {
    selectedItemId: string | null
    previewMode: boolean
    previewLocale: string
    previewDevice: 'desktop' | 'tablet' | 'mobile'
    isPropertiesExpanded: boolean

    setSelectedItem: (itemId: string | null) => void
    setPreviewMode: (enabled: boolean) => void
    setPreviewLocale: (locale: string) => void
    setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
    togglePropertiesExpanded: () => void
}

export const createBuilderUiSlice: StateCreator<FormBuilderState, [], [], BuilderUiSlice> = (set) => ({
    selectedItemId: null,
    previewMode: false,
    previewLocale: 'en',
    previewDevice: 'desktop',
    isPropertiesExpanded: false,

    setSelectedItem: (itemId) => {
        set({ selectedItemId: itemId })
    },

    setPreviewMode: (enabled) => {
        set({ previewMode: enabled })
    },

    setPreviewLocale: (locale) => {
        set({ previewLocale: locale })
    },

    setPreviewDevice: (device) => {
        set({ previewDevice: device })
    },

    togglePropertiesExpanded: () => {
        set((state) => ({ isPropertiesExpanded: !state.isPropertiesExpanded }))
    },
})