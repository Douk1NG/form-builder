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

export type BaseField = {
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

/**
 * A row that renders two fields side-by-side in a 2-column layout.
 * Slots hold a plain Field or null (empty slot).
 */
export type ColumnRow = {
    id: string;
    kind: 'column_row';
    leftField: Field | null;
    rightField: Field | null;
};

/**
 * A canvas-aware field — a plain Field tagged with kind:'field' so it can
 * participate in discriminated unions alongside ColumnRow and FieldGroup.
 */
export type CanvasField = Field & {
    id: string;
    kind: 'field';
};

/**
 * A named group section containing canvas fields and/or column rows.
 * All items carry a `kind` so they can be discriminated at runtime.
 */
export type FieldGroup = {
    id: string;
    kind: 'field_group';
    label: string;
    items: Array<CanvasField | ColumnRow>;
};

/**
 * Any item that can appear at the top level of the canvas.
 */
export type CanvasItem = CanvasField | ColumnRow | FieldGroup;

export type FormProps = {
    fields: Fields;
    values: Record<string, unknown>;
    translate?: (key: string) => string;
    action: (id: string | undefined, prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>;
    onEditModeChange?: (editing: boolean) => void;
    isEditing?: boolean;
    isCreating?: boolean;
    onSuccess?: (state: ActionResponse) => void;
    onError?: (error: unknown) => void;
}
