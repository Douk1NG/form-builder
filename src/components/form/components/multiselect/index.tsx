import { useRef, useCallback } from 'react'
import { useInheritanceContext } from '../../../../context/InheritanceProvider'
import { useDebouncedCallback } from 'use-debounce'
import { useFieldInheritance } from '../../../../hooks/use-field-inheritance'
import Multiselect from 'react-select'

import type { MultiselectField } from '../../../../types/form'

export default function Component({
    id,
    options = [],
    value = [],
    name,
    placeholder = '',
    readOnly,
    inheritFrom,
    onChange: innerOnChange
}: MultiselectField) {
    const selectRef = useRef<React.ElementRef<typeof Multiselect>>(null)

    const { onChange: onChangeInheritance } = useInheritanceContext()

    const inheritanceMethod = useCallback((value: unknown) => {
        if (selectRef.current) {
            selectRef.current.setValue(value, 'select-option')
        }
    }, [])

    useFieldInheritance(inheritFrom, inheritanceMethod)

    const handleChange = useDebouncedCallback((value: unknown) => {
        onChangeInheritance?.(name, value)
        innerOnChange?.(value)
    }, 400)

    return (
        <Multiselect
            {...(id ? { id } : {})}
            ref={selectRef}
            placeholder={placeholder}
            defaultValue={value}
            isMulti
            options={options}
            className='select-tw-fix'
            isClearable={true}
            closeMenuOnSelect={true}
            onChange={handleChange}
            isDisabled={readOnly}
            {...(name ? { name } : {})}
        />
    )
}
