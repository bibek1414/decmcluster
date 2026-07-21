import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dynamicDataService,
  EvacuationCentreRecord,
  DisplacementRecord,
  VillageAssessmentRecord,
} from "@/services/dynamic-data";

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
      if (isEvac) {
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fields: any) => {
      if (isEvac) {
        return dynamicDataService.createEvacuationCentre(fields, token);
      } else if (isVillage) {
        return dynamicDataService.createVillageAssessment(fields, token);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, fields }: { id: number; fields: any }) => {
      if (isEvac) {
        return dynamicDataService.updateEvacuationCentre(id, fields, token);
      } else if (isVillage) {
        return dynamicDataService.updateVillageAssessment(id, fields, token);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (isEvac) {
        return dynamicDataService.deleteEvacuationCentre(id, token);
      } else if (isVillage) {
        return dynamicDataService.deleteVillageAssessment(id, token);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (isEvac) {
        return dynamicDataService.importEvacuationCentres(file, token);
      } else if (isVillage) {
        return dynamicDataService.importVillageAssessments(file, token);
      } else {
        return dynamicDataService.importDisplacements(file, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dynamic-data"] });
    },
  });
}
