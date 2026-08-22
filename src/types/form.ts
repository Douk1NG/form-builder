import type { ImageUploaderProps } from './image-uploader';
import type { Option } from './select';
import { ITEM_KINDS } from './itemKinds';

export type ActionResponse = {
    success: boolean;
    message: LocalizedString;
    errors?: {
        [x: string]: LocalizedString[] | undefined;
    };
    data: Record<string, unknown>;
}

export type LocalizedString = string | Record<string, string>;

export type FieldStyle = {
    labelColor?: string;
    labelSize?: string;
    labelTransform?: 'none' | 'uppercase';
    labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    inputBackgroundColor?: string;
    inputBorderColor?: string;
    inputBorderRadius?: string;
};

export type GroupStyle = {
    titleColor?: string;
    titleSize?: string;
    titleTransform?: 'none' | 'uppercase';
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    borderStyle?: 'none' | 'solid' | 'dashed';
    padding?: string;
};

export type FormStyle = {
    backgroundColor?: string;
    fontFamily?: string;
    gap?: string;
};

export type FieldType = 'text' | 'select' | 'textarea' | 'currency' | 'multiselect' | 'switch' | 'tagbox' | 'image' | 'group_variant_inventory' | 'group_variant_product' | 'number';

export type BaseField = {
    id?: string;
    label: LocalizedString;
    name?: string;
    description?: LocalizedString;
    placeholder?: LocalizedString;
    value?: unknown;
    inheritFrom?: {
        field: string;
        property: string;
    };
    readOnly?: boolean;
    onChange?: (value: unknown) => void;
    defaultValue?: unknown;
    disabled?: boolean;
    translate?: (key: string) => string;
    validationType?: 'none' | 'email' | 'phone' | 'url';
    style?: FieldStyle;
}

export type WithOptions = {
    options?: Option[];
}

export type TextField = BaseField & {
    type: 'text';
};

export type SelectField = BaseField & WithOptions & {
    type: 'select';
};

export type TextAreaField = BaseField & {
    type: 'textarea';
};

export type CurrencyField = BaseField & {
    type: 'currency';
};

export type MultiselectField = BaseField & WithOptions & {
    type: 'multiselect';
};

export type SwitchField = BaseField & {
    type: 'switch';
};

export type TagboxField = BaseField & WithOptions & {
    type: 'tagbox';
};

export type ImageField = BaseField & ImageUploaderProps & {
    type: 'image';
    avatarMode?: boolean;
};

export type GroupField = BaseField & WithOptions & {
    type: 'group_variant_inventory' | 'group_variant_product';
};

export type NumberField = BaseField & {
    type: 'number';
};

/** A plain form field without any canvas-specific metadata. */
export type Field =
    | TextField
    | TextAreaField
    | GroupField
    | CurrencyField
    | MultiselectField
    | SwitchField
    | SelectField
    | TagboxField
    | ImageField
    | NumberField;

export type Fields = Field[];

export type NewFieldInput = {
    type: FieldType;
    label: LocalizedString;
    name?: string;
    description?: LocalizedString;
    placeholder?: LocalizedString;
    options?: Option[];
};

/**
 * A canvas-aware field — a plain Field tagged with kind:'field' so it can
 * participate in discriminated unions alongside FieldGroup.
 */
export type CanvasField = Field & {
    id: string;
    kind: typeof ITEM_KINDS.FIELD;
};

/**
 * A named group section containing canvas fields and/or other nested groups.
 * All items carry a `kind` so they can be discriminated at runtime.
 */
export type FieldGroup = {
    id: string;
    kind: typeof ITEM_KINDS.FIELD_GROUP;
    label?: LocalizedString;
    columns?: number;
    items: Array<CanvasField | FieldGroup>;
    style?: GroupStyle;
    hideHeader?: boolean;
    borderless?: boolean;
};

/**
 * Any item that can appear at the top level of the canvas.
 */
export type CanvasItem = CanvasField | FieldGroup;

export type FormProps = {
    fields: Array<Field | CanvasItem>;
    values: Record<string, unknown>;
    locale?: string;
    translate?: (key: string) => string;
    submitLabel?: LocalizedString;
    action: (id: string | undefined, prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
    onEditModeChange?: (editing: boolean) => void;
    isEditing?: boolean;
    isCreating?: boolean;
    onSuccess?: (state: ActionResponse) => void;
    onError?: (error: unknown) => void;
}
