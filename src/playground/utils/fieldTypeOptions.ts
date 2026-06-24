import type { FieldType } from '@/types/form'

export type FieldTypeOption = {
    type: FieldType
    label: string
    icon: string
}

export const fieldTypeOptions: FieldTypeOption[] = [
    { type: 'text', label: 'Text Input', icon: 'Type' },
    { type: 'textarea', label: 'Text Area', icon: 'AlignLeft' },
    { type: 'number', label: 'Number', icon: 'Hash' },
    { type: 'select', label: 'Select', icon: 'List' },
    { type: 'multiselect', label: 'Multi Select', icon: 'ListChecks' },
    { type: 'currency', label: 'Currency', icon: 'DollarSign' },
    { type: 'switch', label: 'Switch', icon: 'ToggleRight' },
    { type: 'tagbox', label: 'Tags', icon: 'Tags' },
    { type: 'image', label: 'Image Upload', icon: 'Image' },
]