import { z } from "zod";

export interface ColumnDef {
  key: string;
  label: string;
  readonly?: boolean;
}

export function validateTabFields(
  columns: ColumnDef[],
  data: Record<string, any>,
  fieldsToValidate?: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  const activeKeys = fieldsToValidate || columns.map((c) => c.key);

  for (const col of columns) {
    if (col.readonly) continue;
    if (activeKeys.includes(col.key)) {
      const val = data[col.key];
      if (val === "" || val === null || val === undefined) {
        errors[col.key] = `${col.label} is required.`;
      }
    }
  }

  return errors;
}
