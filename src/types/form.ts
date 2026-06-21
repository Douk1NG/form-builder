import type { ImageUploaderProps } from './image-uploader';
import type { Option } from './select';

export type ActionResponse = {
    success: boolean;
    message: string;
    errors?: {
        [x: string]: string[] | undefined;
    };
    data: Record<string, unknown>;
}

export type FieldType = 'text' | 'select' | 'textarea' | 'currency' | 'multiselect' | 'switch' | 'tagbox' | 'image' | 'group_variant_inventory' | 'group_variant_product' | 'number';

export interface BaseField {
    id?: string;
    label: string;
    name?: string;
    description?: string;
    placeholder?: string;
    value?: unknown;
    inheritFrom?: {
        field: string;
        property: string;
    };
    readOnly?: boolean;
    onChange?: (value: unknown) => void;
    defaultValue?: unknown;
    disabled?: boolean;
}

export interface WithOptions {
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

export type TagboxField = BaseField & {
    type: 'tagbox';
};

export type ImageField = BaseField & ImageUploaderProps & {
    type: 'image';
};

export type GroupField = BaseField & WithOptions & {
    type: 'group_variant_inventory' | 'group_variant_product';
};

export type NumberField = BaseField & {
    type: 'number';
};

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

export type FormProps = {
    fields: Fields;
    values: Record<string, unknown>;
    translate?: (key: string) => string;
    action: (id: string | undefined, prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
    onEditModeChange?: (editing: boolean) => void;
    isEditing?: boolean;
    isCreating?: boolean;
    onSuccess?: (state: ActionResponse) => void;
    onError?: (error: any) => void;
}
