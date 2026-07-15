import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { powerbiService } from "@/services/powerbi";
import { PowerBIData } from "@/types/powerbi";

export function usePowerBI(token: string | null) {
  return useQuery<PowerBIData[]>({
    queryKey: ["powerbi-config"],
    queryFn: () => powerbiService.get(token),
  });
}

export function useUpdatePowerBI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
      iframeLink,
      token,
    }: {
      id: number;
      name: string;
      iframeLink: string;
      token: string | null;
    }) => powerbiService.update(id, name, iframeLink, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["powerbi-config"] });
    },
  });
}
