import { useTranslation } from 'react-i18next'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import { SUPPORTED_LOCALES } from '../../utils/locales'

export function useLocaleSwitcher() {
    const { i18n } = useTranslation()
    const previewLocale = useFormBuilderStore((state) => state.previewLocale)
    const setPreviewLocale = useFormBuilderStore((state) => state.setPreviewLocale)

    const currentLocaleIndex = SUPPORTED_LOCALES.indexOf(previewLocale)
    const nextLocaleIndex = (currentLocaleIndex + 1) % SUPPORTED_LOCALES.length
    const nextLocale = SUPPORTED_LOCALES[nextLocaleIndex]

    const handleToggleLocale = () => {
        setPreviewLocale(nextLocale)
        i18n.changeLanguage(nextLocale)
    }

    return {
        previewLocale,
        handleToggleLocale,
    }
}