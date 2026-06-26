import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Languages } from 'lucide-react'
import { SUPPORTED_LOCALES } from '@/utils/locales'
import { useLocalizedInput } from '@/playground/hooks/useLocalizedInput'
import { useTranslation } from 'react-i18next'
import type { LocalizedString } from '@/types/form'

type LocalizedInputProps = {
  id: string
  value: LocalizedString | undefined
  onChange: (value: LocalizedString) => void
  placeholder?: string
  label?: string
}

export function LocalizedInput({
  id,
  value,
  onChange,
  placeholder,
  label
}: LocalizedInputProps) {
  const {
    isLocalized,
    toggleLocalization,
    handleStringChange,
    handleLocalizedChange
  } = useLocalizedInput({ value, onChange })

  const { t: translations } = useTranslation('translation',
    { keyPrefix: 'playground.builder.localizedInput' })

  const isStringValue = typeof value === 'string'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <Label
          htmlFor={id}
          className="text-sm font-medium">{label}</Label>}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-6 px-2 text-xs ${isLocalized ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
          onClick={toggleLocalization}
          title={translations('toggleBtnTitle')}
        >
          <Languages className="w-3 h-3 mr-1" />
          {translations('translate')}
        </Button>
      </div>

      {!isLocalized ? (
        <Input
          id={id}
          value={isStringValue ? value : ''}
          onChange={handleStringChange}
          placeholder={placeholder}
          className="transition-all focus:ring-primary/30 rounded-lg"
        />
      ) : (
        <div className="space-y-2 bg-muted/20 p-3 rounded-lg border border-border/40">
          {SUPPORTED_LOCALES.map(locale => {
            const localizedValue = typeof value === 'object' && value !== null ? value : {}
            const inputValue = localizedValue[locale] || ''

            return (
              <div key={locale} className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground w-6 text-center">{locale}</span>
                <Input
                  value={inputValue}
                  onChange={(e) => handleLocalizedChange(locale, e.target.value)}
                  placeholder={`${placeholder} (${locale.toUpperCase()})`}
                  className="transition-all focus:ring-primary/30 rounded-lg h-8 text-sm"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}