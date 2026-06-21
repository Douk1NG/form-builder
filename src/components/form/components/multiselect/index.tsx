import dynamic from 'next/dynamic'
import { useRef, useCallback } from 'react'
import { useInheritanceContext } from '../../../../context/InheritanceProvider'
import { useDebouncedCallback } from 'use-debounce'
import { useFieldInheritance } from '../../../../hooks/use-field-inheritance'

import type { MultiselectField } from '../../../../types/form'

const Multiselect = dynamic(() => import('react-select'), { ssr: false })

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
    const selectRef = useRef(null)

    const { onChange: onChangeInheritance } = useInheritanceContext()

    const inheritanceMethod = useCallback((value: unknown) => {
        if (selectRef.current) {
            // @ts-expect-error - react-select types are overcomplicated
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
