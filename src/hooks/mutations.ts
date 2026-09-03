import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; reason: string; duration: number }) =>
      api.post(`/admin/users/${data.userId}/suspend`, {
        reason: data.reason,
        duration: data.duration,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contentId: string) =>
      api.delete(`/admin/content/${contentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}
