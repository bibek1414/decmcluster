import { useQuery } from "@tanstack/react-query";
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
