import { Textarea } from '../../../ui/textarea';
import type { TextAreaField } from '../../../../types/form';
import { resolveLocalizedString } from '../../../../utils/locales';

export default function Component(props: TextAreaField) {
    return (
        <Textarea
            placeholder={resolveLocalizedString(props.placeholder)}
            defaultValue={props.value as string}
            id={props.name}
            name={props.name}
            readOnly={props.readOnly}
        />
    )
}
