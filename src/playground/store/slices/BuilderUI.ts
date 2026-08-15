import type { StateCreator } from 'zustand'
import type { FormBuilderState } from '../useFormBuilderStore'
import type { SupportedLocale } from '@/utils/locales'

export type BuilderUiSlice = {
    selectedItemId: string | null
    lockedGroupId: string | null
    previewMode: boolean
    previewLocale: SupportedLocale
    previewDevice: 'desktop' | 'tablet' | 'mobile'
    isPropertiesExpanded: boolean
    isPaletteCollapsed: boolean
    isPropertiesCollapsed: boolean
    isCreateFormDialogOpen: boolean
    isRenameFormDialogOpen: boolean
    isMobilePropertiesHudOpen: boolean

    setSelectedItem: (itemId: string | null) => void
    setLockedGroup: (groupId: string | null) => void
    toggleLockedGroup: (groupId: string) => void
    setPreviewMode: (enabled: boolean) => void
    setPreviewLocale: (locale: SupportedLocale) => void
    setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
    togglePropertiesExpanded: () => void
    setPaletteCollapsed: (collapsed: boolean) => void
    setPropertiesCollapsed: (collapsed: boolean) => void
    setCreateFormDialogOpen: (open: boolean) => void
    setRenameFormDialogOpen: (open: boolean) => void
    setMobilePropertiesHudOpen: (open: boolean) => void
}

export const createBuilderUiSlice: StateCreator<FormBuilderState, [], [], BuilderUiSlice> = (set, get) => ({
    selectedItemId: null,
    lockedGroupId: null,
    previewMode: false,
    previewLocale: 'en',
    previewDevice: 'desktop',
    isPropertiesExpanded: false,
    isPaletteCollapsed: false,
    isPropertiesCollapsed: false,
    isCreateFormDialogOpen: false,
    isRenameFormDialogOpen: false,
    isMobilePropertiesHudOpen: false,

    setSelectedItem: (itemId) => {
        set({ selectedItemId: itemId })
    },

    setLockedGroup: (groupId) => {
        set({ lockedGroupId: groupId })
    },

    toggleLockedGroup: (groupId) => {
        const current = get().lockedGroupId
        set({ lockedGroupId: current === groupId ? null : groupId })
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

    setPaletteCollapsed: (collapsed) => {
        set({ isPaletteCollapsed: collapsed })
    },

    setPropertiesCollapsed: (collapsed) => {
        set({ isPropertiesCollapsed: collapsed })
    },

    setCreateFormDialogOpen: (open) => {
        set({ isCreateFormDialogOpen: open })
    },

    setRenameFormDialogOpen: (open) => {
        set({ isRenameFormDialogOpen: open })
    },

    setMobilePropertiesHudOpen: (open) => {
        set({ isMobilePropertiesHudOpen: open })
    },
})