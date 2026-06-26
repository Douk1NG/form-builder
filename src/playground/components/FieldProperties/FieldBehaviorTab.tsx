import { LabeledSwitchRow } from './LabeledSwitchRow'
import { useTranslation } from 'react-i18next'

export type FieldBehaviorTabProps = {
  readOnly: boolean
  disabled: boolean
  onReadOnlyChange: (checked: boolean) => void
  onDisabledChange: (checked: boolean) => void
}

export function FieldBehaviorTab({
  readOnly,
  disabled,
  onReadOnlyChange,
  onDisabledChange
}: FieldBehaviorTabProps) {

  const { t: translations } = useTranslation('translation', {
    keyPrefix: 'playground.properties.behavior'
  })

  return (
    <div className="space-y-4">
      <LabeledSwitchRow
        id="field-readonly"
        label={translations('readonly.title')}
        description={translations('readonly.description')}
        checked={readOnly}
        onCheckedChange={onReadOnlyChange}
      />

      <LabeledSwitchRow
        id="field-disabled"
        label={translations('disabled.title')}
        description={translations('disabled.description')}
        checked={disabled}
        onCheckedChange={onDisabledChange}
      />
    </div>
  )
}