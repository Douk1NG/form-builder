import { Input } from '../../../ui/input'
import type { TextField } from '../../../../types/form'
import { resolveLocalizedString } from '../../../../utils/locales'

const Component = (props: TextField) => {
    return (
        <Input
            placeholder={resolveLocalizedString(props.placeholder)}
            defaultValue={props.value as string}
            id={props.name}
            name={props.name}
            readOnly={props.readOnly}
            type="text"
        />
    )
}

export default Component
