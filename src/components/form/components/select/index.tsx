import dynamic from 'next/dynamic'
import { useInheritanceContext } from '../../../../context/InheritanceProvider'
import type { SelectField } from '../../../../types/form'
import type { Option } from '../../../../types/select'

const Select = dynamic(() => import('react-select'), { ssr: false })

const Component = ({
    options = [],
    value,
    name,
    placeholder = '',
    readOnly
}: SelectField) => {
    const { onChange } = useInheritanceContext()

    const handleChange = (value: unknown) => {
        onChange?.(name, value)
    }

    const defaultValue = value && (value as Option).value ? value : undefined

    return (
        <Select
            {...(name ? { id: name } : {})}
            options={options}
            {...(defaultValue !== undefined ? { defaultValue } : {})}
            {...(name ? { name } : {})}
            placeholder={placeholder}
            className='select-tw-fix'
            isClearable={true}
            isDisabled={readOnly}
            onChange={handleChange}
        />
    )
}

export default Component
