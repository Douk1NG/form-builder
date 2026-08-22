import { useFieldStyleTab } from '@/playground/hooks/useFieldStyleTab'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FieldStyle, GroupStyle } from '@/types/form'

export type FieldStyleTabProps = {
  fieldStyle?: FieldStyle
  onFieldStyleChange?: (style: FieldStyle) => void
  groupStyle?: GroupStyle
  onGroupStyleChange?: (style: GroupStyle) => void
  isGroup?: boolean
}

export function FieldStyleTab({
  fieldStyle,
  onFieldStyleChange = () => {},
  groupStyle,
  onGroupStyleChange = () => {},
  isGroup = false
}: FieldStyleTabProps) {

  const { updateFieldStyle, updateGroupStyle } = useFieldStyleTab({
    fieldStyle,
    onFieldStyleChange,
    groupStyle,
    onGroupStyleChange
  })

  if (isGroup) {
    return (
      <div className="space-y-4">
        {/* Title Color */}
        <div className="space-y-2">
          <Label htmlFor="group-title-color" className="text-sm font-medium">Header Title Color</Label>
          <Input
            id="group-title-color"
            value={groupStyle?.titleColor ?? ''}
            onChange={(e) => updateGroupStyle('titleColor', e.target.value)}
            placeholder="e.g. #e07a5f or orange"
            className="transition-all focus:ring-primary/30 rounded-lg"
          />
        </div>

        {/* Group Background */}
        <div className="space-y-2">
          <Label htmlFor="group-bg-color" className="text-sm font-medium">Group Background Color</Label>
          <Input
            id="group-bg-color"
            value={groupStyle?.backgroundColor ?? ''}
            onChange={(e) => updateGroupStyle('backgroundColor', e.target.value)}
            placeholder="e.g. #f5f0e8"
            className="transition-all focus:ring-primary/30 rounded-lg"
          />
        </div>

        {/* Border Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Border Style</Label>
          <Select
            value={groupStyle?.borderStyle ?? 'solid'}
            onValueChange={(val) => updateGroupStyle('borderStyle', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select border style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Borderless)</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Border Color */}
        {groupStyle?.borderStyle !== 'none' && (
          <div className="space-y-2">
            <Label htmlFor="group-border-color" className="text-sm font-medium">Border Color</Label>
            <Input
              id="group-border-color"
              value={groupStyle?.borderColor ?? ''}
              onChange={(e) => updateGroupStyle('borderColor', e.target.value)}
              placeholder="e.g. #e2e8f0"
              className="transition-all focus:ring-primary/30 rounded-lg"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-border/40 pb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Typography</h4>
      </div>

      {/* Label Color */}
      <div className="space-y-2">
        <Label htmlFor="field-label-color" className="text-sm font-medium">Label Color</Label>
        <Input
          id="field-label-color"
          value={fieldStyle?.labelColor ?? ''}
          onChange={(e) => updateFieldStyle('labelColor', e.target.value)}
          placeholder="e.g. #1a1a2e or black"
          className="transition-all focus:ring-primary/30 rounded-lg"
        />
      </div>

      {/* Label Casing / Transform */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Label Casing</Label>
        <Select
          value={fieldStyle?.labelTransform ?? 'none'}
          onValueChange={(val) => updateFieldStyle('labelTransform', val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select casing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Normal</SelectItem>
            <SelectItem value="uppercase">UPPERCASE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Label Weight */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Label Weight</Label>
        <Select
          value={fieldStyle?.labelWeight ?? 'medium'}
          onValueChange={(val) => updateFieldStyle('labelWeight', val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="semibold">Semibold</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border-b border-border/40 pb-2 pt-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input Box</h4>
      </div>

      {/* Input Background */}
      <div className="space-y-2">
        <Label htmlFor="field-input-bg" className="text-sm font-medium">Input Background</Label>
        <Input
          id="field-input-bg"
          value={fieldStyle?.inputBackgroundColor ?? ''}
          onChange={(e) => updateFieldStyle('inputBackgroundColor', e.target.value)}
          placeholder="e.g. #f4f4f5"
          className="transition-all focus:ring-primary/30 rounded-lg"
        />
      </div>

      {/* Input Border Color */}
      <div className="space-y-2">
        <Label htmlFor="field-input-border" className="text-sm font-medium">Input Border Color</Label>
        <Input
          id="field-input-border"
          value={fieldStyle?.inputBorderColor ?? ''}
          onChange={(e) => updateFieldStyle('inputBorderColor', e.target.value)}
          placeholder="e.g. #e4e4e7"
          className="transition-all focus:ring-primary/30 rounded-lg"
        />
      </div>

      {/* Input Corner Radius */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Corner Radius</Label>
        <Select
          value={fieldStyle?.inputBorderRadius ?? 'md'}
          onValueChange={(val) => updateFieldStyle('inputBorderRadius', val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select corner radius" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (Sharp)</SelectItem>
            <SelectItem value="sm">Small (rounded-sm)</SelectItem>
            <SelectItem value="md">Medium (rounded-md)</SelectItem>
            <SelectItem value="lg">Large (rounded-lg)</SelectItem>
            <SelectItem value="full">Full (rounded-full)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
