import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dynamicDataService,
  EvacuationCentreRecord,
  DisplacementRecord,
  VillageAssessmentRecord,
  FiveWActivityRecord,
} from "@/services/dynamic-data";

const GENERIC_FORM_SLUGS = [
  "durable-solution-relocation-survey",
  "service-monitoring-tool-2026",
  "displacement-tracking-matrix-form",
  "rapid-assessment-form-area-council",
  "community-level-damage-assessment-form",
  "displacement-profile-phone-survey",
  "damage-assessment-form-community-v2",
];

export function useDynamicData(
  slug: string,
  page: number,
  search: string,
  provinceFilter: string,
  districtFilter: string,
  opFilter: string,
  token: string | null,
  pageSize: number = 50,
) {
  const isEvac = slug === "evacuation-centre-assessment-form" || slug === "evacuation-centre-data";
  const isVillage = slug === "village-assessment" || slug === "village-assessments";
  const isFiveW = slug === "5w-response-data" || slug === "fivew";
  const isGeneric = GENERIC_FORM_SLUGS.includes(slug);

  return useQuery({
    queryKey: [
      "dynamic-data",
      slug,
      page,
      search,
      provinceFilter,
      districtFilter,
      opFilter,
      token,
      pageSize,
    ],
    queryFn: async () => {
      if (isGeneric) {
        return dynamicDataService.fetchGenericFormRecords(slug, page, search, token, pageSize);
      } else if (isEvac) {
        return dynamicDataService.fetchEvacuationCentres(
          page,
          search,
          token,
          provinceFilter,
          districtFilter,
          opFilter,
          pageSize,
        );
      } else if (isVillage) {
        return dynamicDataService.fetchVillageAssessments(
          page,
          search,
          token,
          provinceFilter,
          districtFilter,
          opFilter,
          pageSize,
        );
      } else if (isFiveW) {
        return dynamicDataService.fetchFiveWActivities(
          page,
          search,
          token,
          provinceFilter,
          districtFilter,
          opFilter,
          pageSize,
        );
      } else {
        return dynamicDataService.fetchDisplacements(
          page,
          search,
          token,
          provinceFilter,
          districtFilter,
          opFilter,
          pageSize,
        );
      }
    },
  });
}

export function useCreateDynamicRecord(slug: string, token: string | null) {
  const isEvac = slug === "evacuation-centre-assessment-form" || slug === "evacuation-centre-data";
  const isVillage = slug === "village-assessment" || slug === "village-assessments";
  const isFiveW = slug === "5w-response-data" || slug === "fivew";
  const isGeneric = GENERIC_FORM_SLUGS.includes(slug);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fields: any) => {
      if (isGeneric) {
        return dynamicDataService.createGenericFormRecord(slug, fields, token);
      } else if (isEvac) {
        return dynamicDataService.createEvacuationCentre(fields, token);
      } else if (isVillage) {
        return dynamicDataService.createVillageAssessment(fields, token);
      } else if (isFiveW) {
        return dynamicDataService.createFiveWActivity(fields, token);
      } else {
        return dynamicDataService.createDisplacement(fields, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
    },
  });
}

export function useUpdateDynamicRecord(slug: string, token: string | null) {
  const isEvac = slug === "evacuation-centre-assessment-form" || slug === "evacuation-centre-data";
  const isVillage = slug === "village-assessment" || slug === "village-assessments";
  const isFiveW = slug === "5w-response-data" || slug === "fivew";
  const isGeneric = GENERIC_FORM_SLUGS.includes(slug);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, fields }: { id: number; fields: any }) => {
      if (isGeneric) {
        return dynamicDataService.updateGenericFormRecord(slug, id, fields, token);
      } else if (isEvac) {
        return dynamicDataService.updateEvacuationCentre(id, fields, token);
      } else if (isVillage) {
        return dynamicDataService.updateVillageAssessment(id, fields, token);
      } else if (isFiveW) {
        return dynamicDataService.updateFiveWActivity(id, fields, token);
      } else {
        return dynamicDataService.updateDisplacement(id, fields, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
    },
  });
}

export function useDeleteDynamicRecord(slug: string, token: string | null) {
  const isEvac = slug === "evacuation-centre-assessment-form" || slug === "evacuation-centre-data";
  const isVillage = slug === "village-assessment" || slug === "village-assessments";
  const isFiveW = slug === "5w-response-data" || slug === "fivew";
  const isGeneric = GENERIC_FORM_SLUGS.includes(slug);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (isGeneric) {
        return dynamicDataService.deleteGenericFormRecord(slug, id, token);
      } else if (isEvac) {
        return dynamicDataService.deleteEvacuationCentre(id, token);
      } else if (isVillage) {
        return dynamicDataService.deleteVillageAssessment(id, token);
      } else if (isFiveW) {
        return dynamicDataService.deleteFiveWActivity(id, token);
      } else {
        return dynamicDataService.deleteDisplacement(id, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
    },
  });
}

export function useImportDynamicRecord(slug: string, token: string | null) {
  const isEvac = slug === "evacuation-centre-assessment-form" || slug === "evacuation-centre-data";
  const isVillage = slug === "village-assessment" || slug === "village-assessments";
  const isFiveW = slug === "5w-response-data" || slug === "fivew";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (isEvac) {
        return dynamicDataService.importEvacuationCentres(file, token);
      } else if (isVillage) {
        return dynamicDataService.importVillageAssessments(file, token);
      } else if (isFiveW) {
        return dynamicDataService.importFiveWActivities(file, token);
      } else {
        return dynamicDataService.importDisplacements(file, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
    },
  });
}
