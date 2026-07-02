import { useQuery } from "@tanstack/react-query";
import { getAnalyticsData } from "../services/analyticsService";

export function useAnalytics(userId: string, month: string) {
  return useQuery({
    queryKey: ["analytics", userId, month],
    queryFn: () => getAnalyticsData(userId, month),
    enabled: !!userId && !!month,
  });
}
