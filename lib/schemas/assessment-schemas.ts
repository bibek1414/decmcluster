export interface ColumnDef {
  key: string;
  label: string;
  readonly?: boolean;
}

export const REQUIRED_FIELDS_BY_SLUG: Record<string, string[]> = {
  "displacement-data": ["operation"],
  "displacements": ["operation"],
  "evacuation-centre-assessment-form": ["compound_name"],
  "evacuation-centre-data": ["compound_name"],
  "village-assessment": ["village_name"],
  "village-assessments": ["village_name"],
  "5w-response-data": ["activity_name", "reporting_organization"],
  "fivew": ["activity_name", "reporting_organization"],
};

export function isFieldCompulsory(slug: string, key: string): boolean {
  const compulsoryKeys = REQUIRED_FIELDS_BY_SLUG[slug] || [];
  return compulsoryKeys.includes(key);
}

export function validateTabFields(
  slug: string,
  columns: ColumnDef[],
  data: Record<string, any>,
  fieldsToValidate?: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  const compulsoryKeys = REQUIRED_FIELDS_BY_SLUG[slug] || [];
  const activeKeys = fieldsToValidate || columns.map((c) => c.key);

  for (const col of columns) {
    if (col.readonly) continue;
    if (activeKeys.includes(col.key) && compulsoryKeys.includes(col.key)) {
      const val = data[col.key];
      if (val === "" || val === null || val === undefined) {
        errors[col.key] = `${col.label} is required.`;
      }
    }
  }

  return errors;
}
