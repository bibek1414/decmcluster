import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { meetingMinuteService } from "@/services/meeting-minute";
import { MeetingMinuteData } from "@/types/admin/meeting-minute";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useMeetingMinutes(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<MeetingMinuteData>>({
    queryKey: ["meeting-minutes-list", page, token, search],
    queryFn: () => meetingMinuteService.list(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useUploadMeetingMinute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file, token }: { name: string; file: File; token: string | null }) =>
      meetingMinuteService.create(name, file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
  });
}

export function useDeleteMeetingMinute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      meetingMinuteService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
  });
}

export function useReverifyMeetingMinute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      meetingMinuteService.reverify(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
  });
}

export function useUploadNewMeetingMinute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file, token }: { id: number; file: File; token: string | null }) => {
      const updated = await meetingMinuteService.updateFile(id, file, token);
      await meetingMinuteService.reverify(id, token);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
  });
}
