import { Input } from '../../../ui/input'
import type { TextField } from '../../../../types/form'

const Component = (props: TextField) => {
    return (
        <Input
            placeholder={props.placeholder}
            defaultValue={props.value as string}
            id={props.name}
            name={props.name}
            readOnly={props.readOnly}
            type="text"
        />
    )
}

export default Component
