import { FieldOptionsEditor } from './FieldOptionsEditor'
import type { Option } from '@/types/select'

export type FieldDataTabProps = {
    options: Option[]
    onChange: (options: Option[]) => void
}

export function FieldDataTab({ options, onChange }: FieldDataTabProps) {
    return (
        <FieldOptionsEditor
            options={options}
            onChange={onChange}
        />
    )
}