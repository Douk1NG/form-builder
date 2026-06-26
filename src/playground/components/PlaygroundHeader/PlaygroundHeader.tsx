import { Button } from '@/components/ui/button'
import { DeviceToggleButton } from './DeviceToggleButton'
import { deviceToggleOptions } from '@/playground/utils/deviceToggleOptions'
import { FormBuilderLogo } from './FormBuilderLogo'
import { FormSwitcher } from './FormSwitcher'
import { LocaleSwitcher } from './LocaleSwitcher'
import { Eye, Pencil, Download } from 'lucide-react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { usePlayground } from '@/playground/hooks/usePlayground'
import { useTranslation } from 'react-i18next'

export function PlaygroundHeader() {
  const {
    formId,
    previewMode,
    handleTogglePreview,
    handleExportJson,
  } = usePlayground()

  const { t: translations } = useTranslation('translation', {
    keyPrefix: 'playground.builder.header'
  })

  const previewDevice = useFormBuilderStore((state) => state.previewDevice)
  const setPreviewDevice = useFormBuilderStore((state) => state.setPreviewDevice)

  return (
    <header className="px-6 py-3 border-b bg-card/80 backdrop-blur-xl border-border/50 shadow-xs sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FormBuilderLogo />
          <FormSwitcher />
        </div>

        <div className="flex items-center gap-2">
          {formId && previewMode && (
            <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50 mr-2">
              {deviceToggleOptions.map(({ device, iconName }) => (
                <DeviceToggleButton
                  key={device}
                  device={device}
                  activeDevice={previewDevice}
                  iconName={iconName}
                  onSelect={setPreviewDevice}
                />
              ))}
            </div>
          )}
          <LocaleSwitcher />
          {formId && (
            <>
              <Button
                variant={previewMode ? 'default' : 'outline'}
                size="sm"
                onClick={handleTogglePreview}
                className="transition-all duration-200 rounded-lg gap-2"
              >
                {previewMode ? (
                  <>
                    <Pencil className="w-3.5 h-3.5" />
                    {translations('editMode')}
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    {translations('previewMode')}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                className="transition-all duration-200 hover:bg-primary/5 rounded-lg gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                {translations('exportJson')}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}