import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DeviceToggleButton } from './DeviceToggleButton'
import { deviceToggleOptions } from '@/playground/utils/deviceToggleOptions'
import { FormSwitcher } from './FormSwitcher'
import { LocaleSwitcher } from './LocaleSwitcher'
import { Eye, Pencil, Download, MoreHorizontal } from 'lucide-react'
import { usePlayground } from '@/playground/hooks/usePlayground'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/playground/hooks/useIsMobile'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

export function PlaygroundHeader() {
  const {
    formId,
    previewMode,
    previewDevice,
    setPreviewDevice,
    handleTogglePreview,
    handleExportJson,
  } = usePlayground()

  const isMobile = useIsMobile()
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false)
  const setRenameFormDialogOpen = useFormBuilderStore((state) => state.setRenameFormDialogOpen)

  const { t: translations } = useTranslation('translation', {
    keyPrefix: 'playground.builder.header'
  })

  const toggleActionsDropdown = () => {
    setIsActionsDropdownOpen((prev) => !prev)
  }

  return (
    <header className="px-4 py-3 border-b bg-card/80 backdrop-blur-xl border-border/50 shadow-xs sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: switcher only on mobile, switcher + logo on desktop */}
        <div className="flex items-center min-w-0">
          <FormSwitcher />
        </div>

        {/* Right side: normal row on desktop, action dropdown toggle on mobile */}
        {isMobile ? (
          <div className="flex items-center gap-2 relative">
            {formId && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleActionsDropdown}
                  className="rounded-lg h-9 w-9 p-0"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>

                {isActionsDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/60 rounded-xl shadow-lg p-2 z-50 flex flex-col gap-1.5 animate-in fade-in-50 slide-in-from-top-1">
                    {/* Locale Switcher */}
                    <div className="px-2 py-1 border-b border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                      <span>Language</span>
                      <LocaleSwitcher />
                    </div>

                    {/* Rename Form (Mobile Dialog) */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRenameFormDialogOpen(true)
                        setIsActionsDropdownOpen(false)
                      }}
                      className="w-full justify-start rounded-lg text-xs gap-2"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Rename Form
                    </Button>

                    {/* Export Schema */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleExportJson()
                        setIsActionsDropdownOpen(false)
                      }}
                      className="w-full justify-start rounded-lg text-xs gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {translations('exportJson')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {formId && previewMode && !isMobile && (
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
        )}
      </div>
    </header>
  )
}