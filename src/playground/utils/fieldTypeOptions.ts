import type { FieldType } from '@/types/form'
import type { IconName } from 'lucide-react/dynamic'

export type FieldTypeOption = {
    type: FieldType
    label: string
    icon: IconName
}

export const fieldTypeOptions: FieldTypeOption[] = [
    { type: 'text', label: 'Text Input', icon: 'type' },
    { type: 'textarea', label: 'Text Area', icon: 'align-left' },
    { type: 'number', label: 'Number', icon: 'hash' },
    { type: 'select', label: 'Select', icon: 'list' },
    { type: 'multiselect', label: 'Multi Select', icon: 'list-checks' },
    { type: 'currency', label: 'Currency', icon: 'dollar-sign' },
    { type: 'switch', label: 'Switch', icon: 'toggle-right' },
    { type: 'tagbox', label: 'Tags', icon: 'tags' },
    { type: 'image', label: 'Image Upload', icon: 'image' },
]