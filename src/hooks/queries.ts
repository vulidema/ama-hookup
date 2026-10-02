import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMyProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => api.get("/profile/me"),
  });
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: ["profile", id],
    enabled: !!id,
    queryFn: () => api.get(`/profile/${id}`),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Record<string, unknown>) => api.patch("/profile/me", updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.upload("/profile/avatar", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSwitchRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role: "member" | "host") => api.patch("/profile/role", { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useActiveHostsFeed(lat: number, lng: number, radiusKm = 50) {
  return useQuery({
    queryKey: ["discover", lat, lng, radiusKm],
    enabled: !!lat && !!lng,
    queryFn: () => api.get(`/discover/hosts?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`),
  });
}

export function useMyChatRequests() {
  return useQuery({
    queryKey: ["chat-requests", "me"],
    queryFn: () => api.get("/chat-requests/me"),
  });
}

export function useRespondToChatRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: "accept" | "decline" }) =>
      api.post(`/chat-requests/${requestId}/respond`, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-requests"] });
    },
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversation", id],
    enabled: !!id,
    queryFn: () => api.get(`/conversations/${id}`),
  });
}

export function useMessages(id: string) {
  return useQuery({
    queryKey: ["messages", id],
    enabled: !!id,
    queryFn: () => api.get(`/conversations/${id}/messages`),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: string }) =>
      api.post(`/conversations/${conversationId}/messages`, { body }),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get("/admin/stats"),
  });
}

export function useAdminUsers(search = "") {
  return useQuery({
    queryKey: ["admin", "users", search],
    queryFn: () => api.get(`/admin/users?search=${encodeURIComponent(search)}`),
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
    mutationFn: ({ reportId, action }: { reportId: string; action: "dismiss" | "remove" | "suspend" }) =>
      api.post(`/admin/reports/${reportId}/resolve`, { action }),
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

export function useAuditLogs(filter = "all") {
  return useQuery({
    queryKey: ["admin", "audit-logs", filter],
    queryFn: () => api.get(`/admin/audit-logs?filter=${filter}`),
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason, duration }: { userId: string; reason: string; duration: number }) =>
      api.post(`/admin/users/${userId}/suspend`, { reason, duration }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contentId: string) => api.delete(`/admin/content/${contentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => api.get("/monitoring/alerts"),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["notificationPreferences"],
    queryFn: () => api.get("/preferences/notifications"),
  });
}

export function useUserInsights() {
  return useQuery({
    queryKey: ["userInsights"],
    queryFn: () => api.get("/analytics/user-insights"),
  });
}

export function useEngagementMetrics() {
  return useQuery({
    queryKey: ["engagementMetrics"],
    queryFn: () => api.get("/analytics/engagement"),
  });
}
