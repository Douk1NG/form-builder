import { useFieldOptionsEditor } from '../hooks/useFieldOptionsEditor'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { CircleX, Plus } from 'lucide-react'
import type { Option } from '../../types/select'

type FieldOptionsEditorProps = {
  options?: Option[]
  onChange: (options: Option[]) => void
  disabled?: boolean
}

export function FieldOptionsEditor({ options = [], onChange, disabled }: FieldOptionsEditorProps) {
  const {
    options: currentOptions,
    handleAddOption,
    handleRemoveOption,
    handleUpdateOption,
  } = useFieldOptionsEditor(options, onChange)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddOption}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>

      <div className="space-y-2">
        {currentOptions.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={option.label}
              onChange={(event) => handleUpdateOption(index, 'label', event.target.value)}
              placeholder="Label"
              disabled={disabled}
            />
            <Input
              value={String(option.value)}
              onChange={(event) => handleUpdateOption(index, 'value', event.target.value)}
              placeholder="Value"
              disabled={disabled}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveOption(index)}
              disabled={disabled}
            >
              <CircleX className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
        {currentOptions.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-2 border border-dashed rounded-md">
            No options defined
          </div>
        )}
      </div>
    </div>
  )
}
