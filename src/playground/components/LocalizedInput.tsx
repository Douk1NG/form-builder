import { useState, useEffect } from 'react'
import { Languages } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import type { LocalizedString } from '../../types/form'
import { SUPPORTED_LOCALES } from '../../utils/locales'

type LocalizedInputProps = {
  id: string
  value: LocalizedString | undefined
  onChange: (value: LocalizedString) => void
  placeholder?: string
  label?: string
}

export function LocalizedInput({ id, value, onChange, placeholder, label }: LocalizedInputProps) {
  const isObject = typeof value === 'object' && value !== null
  const [isLocalized, setIsLocalized] = useState(isObject)

  useEffect(() => {
    setIsLocalized(typeof value === 'object' && value !== null)
  }, [value])

  const toggleLocalization = () => {
    if (isLocalized) {
      // Convert back to single string (take 'en' or first value or empty)
      const newValue = typeof value === 'object' && value !== null
        ? (value['en'] || Object.values(value)[0] || '')
        : (value || '')
      onChange(newValue as string)
      setIsLocalized(false)
    } else {
      // Convert to object
      const currentStr = typeof value === 'string' ? value : ''
      onChange({ en: currentStr, es: '' })
      setIsLocalized(true)
    }
  }

  const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleLocalizedChange = (locale: string, text: string) => {
    const currentObj = (typeof value === 'object' && value !== null) ? { ...value } : {}
    currentObj[locale] = text
    onChange(currentObj)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <Label htmlFor={id} className="text-sm font-medium">{label}</Label>}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-6 px-2 text-xs ${isLocalized ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
          onClick={toggleLocalization}
          title="Toggle Translations"
        >
          <Languages className="w-3 h-3 mr-1" />
          Translate
        </Button>
      </div>

      {!isLocalized ? (
        <Input
          id={id}
          value={typeof value === 'string' ? value : ''}
          onChange={handleStringChange}
          placeholder={placeholder}
          className="transition-all focus:ring-primary/30 rounded-lg"
        />
      ) : (
        <div className="space-y-2 bg-muted/20 p-3 rounded-lg border border-border/40">
          {SUPPORTED_LOCALES.map(locale => (
            <div key={locale} className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-muted-foreground w-6 text-center">{locale}</span>
              <Input
                value={typeof value === 'object' && value !== null ? (value[locale] || '') : ''}
                onChange={(e) => handleLocalizedChange(locale, e.target.value)}
                placeholder={`${placeholder} (${locale.toUpperCase()})`}
                className="transition-all focus:ring-primary/30 rounded-lg h-8 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
