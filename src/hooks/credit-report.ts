import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creditService, reportService } from "@/lib/credit-report";

// Credit queries
export const useCreditBalance = () => {
  return useQuery({
    queryKey: ["credits", "balance"],
    queryFn: () => creditService.getMyCreditBalance(),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useCreditTransactions = () => {
  return useQuery({
    queryKey: ["credits", "transactions"],
    queryFn: () => creditService.getCreditTransactions(),
  });
};

export const useActiveCredits = () => {
  return useQuery({
    queryKey: ["credits", "active"],
    queryFn: () => creditService.getActiveCredits(),
    refetchInterval: 60000,
  });
};

// Report queries
export const useReportUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportedId,
      reason,
      details,
    }: {
      reportedId: string;
      reason: "harassment" | "inappropriate" | "scam" | "other";
      details?: string;
    }) => reportService.reportUser(reportedId, reason, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useMyReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => reportService.getMyReports(),
  });
};
