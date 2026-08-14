import { z } from "zod";

export const displacementSchema = z.object({
  operation: z.string().min(1, "Operation is required."),
  operation_code: z.string().min(1, "Operation Code is required."),
  displacement_reason: z.string().min(1, "Displacement Reason is required."),
  operation_status: z.string().min(1, "Operation Status is required."),
  assessment_type: z.string().min(1, "Assessment Type is required."),
  admin0_name: z.string().optional().nullable(),
  admin0_pcode: z.string().optional().nullable(),
  admin1_name: z.string().optional().nullable(),
  admin1_pcode: z.string().optional().nullable(),
  admin2_name: z.string().optional().nullable(),
  admin2_pcode: z.string().optional().nullable(),
  admin_level: z.union([z.number(), z.string()]).optional().nullable(),
  reporting_date: z.string().optional().nullable(),
  reporting_year: z.union([z.number(), z.string()]).optional().nullable(),
  reporting_month: z.union([z.number(), z.string()]).optional().nullable(),
  round_number: z.union([z.number(), z.string()]).optional().nullable(),
  num_present_idps: z.union([z.number(), z.string()]).optional().nullable(),
  males_number: z.union([z.number(), z.string()]).optional().nullable(),
  female_number: z.union([z.number(), z.string()]).optional().nullable(),
  total_vul_hhs: z.union([z.number(), z.string()]).optional().nullable(),
  idp_origin_admin1_name: z.string().optional().nullable(),
  idp_origin_admin1_pcode: z.string().optional().nullable(),
  idp_destination: z.string().optional().nullable(),
  idp_destination_admin1_name: z.string().optional().nullable(),
  idp_destination_admin1_pcode: z.string().optional().nullable(),
});

export const evacuationCentreSchema = z.object({
  compound_name: z.string().min(1, "Compound Name is required."),
  compound_function: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  area_council: z.string().optional().nullable(),
  island: z.string().optional().nullable(),
  village: z.string().optional().nullable(),
  latitude: z.union([z.number(), z.string()]).optional().nullable(),
  longitude: z.union([z.number(), z.string()]).optional().nullable(),
  primary_contact: z.string().optional().nullable(),
  secondary_contact: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  agency: z.string().optional().nullable(),
});

export const villageAssessmentSchema = z.object({
  village_name: z.string().min(1, "Village Name is required."),
  province: z.string().optional().nullable(),
  area_council: z.string().optional().nullable(),
  survey_start: z.string().optional().nullable(),
  survey_end: z.string().optional().nullable(),
  survey_date: z.string().optional().nullable(),
  assessment_date: z.string().optional().nullable(),
  enumerator_username: z.string().optional().nullable(),
  device_id: z.string().optional().nullable(),
});

export const fivewSchema = z.object({
  activity_name: z.string().min(1, "Activity Name is required."),
  reporting_organization: z.string().min(1, "Reporting Organization is required."),
  cluster: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  implementing_partner: z.string().optional().nullable(),
  donor: z.string().optional().nullable(),
  project_name: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export function getSchemaForSlug(slug: string): z.ZodObject<any> | null {
  if (slug === "displacement-data" || slug === "displacements") {
    return displacementSchema;
  }
  if (slug === "evacuation-centre-assessment-form" || slug === "evacuation-centre-data") {
    return evacuationCentreSchema;
  }
  if (slug === "village-assessment" || slug === "village-assessments") {
    return villageAssessmentSchema;
  }
  if (slug === "5w-response-data" || slug === "fivew") {
    return fivewSchema;
  }
  return null;
}

export function validateTabFields(
  schema: z.ZodObject<any>,
  data: Record<string, any>,
  fieldsToValidate?: string[],
  columns?: any[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  // First check Zod schema requirements
  const result = schema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const fieldKey = String(issue.path[0]);
      if (!fieldsToValidate || fieldsToValidate.includes(fieldKey)) {
        errors[fieldKey] = issue.message;
      }
    }
  }

  // Also check any field on fieldsToValidate that is empty when columns define labels
  if (fieldsToValidate && columns) {
    fieldsToValidate.forEach((fieldKey) => {
      const col = columns.find((c: any) => c.key === fieldKey);
      if (col && !col.readonly) {
        const val = data[fieldKey];
        if ((val === "" || val === null || val === undefined) && !errors[fieldKey]) {
          // If the step's fields are checked on Next and empty, show inline required error text
          errors[fieldKey] = `${col.label} is required.`;
        }
      }
    });
  }

  return errors;
}
