import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import { BannerData } from "@/types/banner";

export function useBanners() {
  return useQuery<BannerData[]>({
    queryKey: ["banners-list"],
    queryFn: () => bannerService.list(),
  });
}
