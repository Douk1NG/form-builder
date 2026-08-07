export const ITEM_KINDS = {
  FIELD: 'field',
  FIELD_GROUP: 'field_group',
  COLUMN_ROW: 'column_row',
} as const;

export type ItemKind = typeof ITEM_KINDS[keyof typeof ITEM_KINDS];
