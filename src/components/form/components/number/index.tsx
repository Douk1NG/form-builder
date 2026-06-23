import { Input } from '../../../ui/input'
import type { NumberField } from '../../../../types/form'
import { resolveLocalizedString } from '../../../../utils/locales'

const Component = (props: NumberField) => {
    return (
        <Input
            placeholder={resolveLocalizedString(props.placeholder)}
            defaultValue={props.value as string}
            id={props.name}
            name={props.name}
            readOnly={props.readOnly}
            type="number"
        />
    )
}

export default Component
