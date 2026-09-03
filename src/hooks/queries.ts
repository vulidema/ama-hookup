import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Existing hooks...

// Admin hooks
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get("/admin/stats"),
  });
}

export function useAdminUsers(search: string = "") {
  return useQuery({
    queryKey: ["admin", "users", search],
    queryFn: () => api.get(`/admin/users?search=${search}`),
  });
}

export function useReportedContent(filter: "pending" | "resolved" | "all" = "pending") {
  return useQuery({
    queryKey: ["admin", "reports", filter],
    queryFn: () => api.get(`/admin/reports?filter=${filter}`),
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { reportId: string; action: "dismiss" | "remove" | "suspend" }) =>
      api.post(`/admin/reports/${data.reportId}/resolve`, { action: data.action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ["admin", "health"],
    queryFn: () => api.get("/admin/system-health"),
  });
}

export function useAuditLogs(filter: string = "all") {
  return useQuery({
    queryKey: ["admin", "audit-logs", filter],
    queryFn: () => api.get(`/admin/audit-logs?filter=${filter}`),
  });
}
