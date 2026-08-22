import Text from "./components/text";
import Textarea from "./components/textarea";
import Currency from "./components/currency";
import MultiSelect from "./components/multiselect";
import Switch from "./components/switch";
import Tagbox from "./components/tagbox";
import Select from "./components/select";
import ImageUploader from "./components/image-uploader";
import GroupInventory from "./components/group/inventory";
import GroupProduct from "./components/group/product";
import Number from "./components/number";
import { Label } from '../ui/label';
import type { Field } from '../../types/form';
import type { JSX, CSSProperties } from "react";

// NOTE: the translation system needs to be reviewed considering the form translations are not part of i18n system but user defined, this means the form is multi language by nature and not tied to i18n library but bc we are using i18n to get the current language we have to use it somehow without breaking the multi language and type safety, this is a temporary workaround, pending review
import { resolveLocalizedString } from '../../utils/locales';

const FONT_WEIGHT_MAP: Record<string, string> = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
}

const BORDER_RADIUS_MAP: Record<string, string> = {
    none: '0px',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
}

const Components = {
    text: Text,
    textarea: Textarea,
    currency: Currency,
    multiselect: MultiSelect,
    switch: Switch,
    tagbox: Tagbox,
    select: Select,
    image: ImageUploader,
    group_variant_inventory: GroupInventory,
    group_variant_product: GroupProduct,
    number: Number
};

const Index = <T extends Field>(props: T) => {
    const Component = Components[props.type] as (props: T) => JSX.Element;
    const {
        label,
        description,
        name,
        readOnly,
        style: fieldStyle,
    } = props;

    if (!Component) {
        return (
            null
        );
    }

    const labelInlineStyles: CSSProperties = {}
    if (fieldStyle?.labelColor) {
        labelInlineStyles.color = fieldStyle.labelColor
    }
    if (fieldStyle?.labelWeight) {
        labelInlineStyles.fontWeight = FONT_WEIGHT_MAP[fieldStyle.labelWeight] ?? '500'
    }
    if (fieldStyle?.labelTransform === 'uppercase') {
        labelInlineStyles.textTransform = 'uppercase'
        labelInlineStyles.letterSpacing = '0.05em'
        labelInlineStyles.fontSize = '0.75rem'
    }

    const inputWrapperStyles: CSSProperties = {}
    if (fieldStyle?.inputBackgroundColor) {
        ;(inputWrapperStyles as Record<string, string>)['--field-input-bg'] = fieldStyle.inputBackgroundColor
    }
    if (fieldStyle?.inputBorderColor) {
        ;(inputWrapperStyles as Record<string, string>)['--field-input-border'] = fieldStyle.inputBorderColor
    }
    if (fieldStyle?.inputBorderRadius) {
        ;(inputWrapperStyles as Record<string, string>)['--field-input-radius'] = BORDER_RADIUS_MAP[fieldStyle.inputBorderRadius] ?? '0.375rem'
    }

    return (
        <div className="w-full space-y-2.5" style={inputWrapperStyles}>
            <Label
                htmlFor={name}
                className="text-base font-medium"
                style={labelInlineStyles}
            >
                {resolveLocalizedString(label)}
            </Label>
            <Component {...props} />
            {!readOnly && description && (
                <p className="text-sm text-muted-foreground/80 mt-1">
                    {resolveLocalizedString(description)}
                </p>
            )}
        </div>
    )

}

export default Index
