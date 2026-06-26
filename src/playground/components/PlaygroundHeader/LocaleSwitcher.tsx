import { Languages } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useLocaleSwitcher } from '../hooks/useLocaleSwitcher'

export function LocaleSwitcher() {
    const {
        previewLocale,
        handleToggleLocale
    } = useLocaleSwitcher()

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleLocale}
            className="font-semibold gap-1.5 rounded-lg transition-all duration-200"
        >
            <Languages className="w-3.5 h-3.5" />
            {previewLocale.toUpperCase()}
        </Button>
    )
}