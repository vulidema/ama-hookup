import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Extension of existing queries for missing hooks

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      api.patch("/profile/location", { lat, lng }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSetOnlineStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isOnline: boolean) =>
      api.patch("/profile/online-status", { is_online: isOnline }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSetStatusMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string | null) =>
      api.patch("/profile/status-message", { status_message: message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useMyWaves() {
  return useQuery({
    queryKey: ["waves", "received"],
    queryFn: () => api.get("/waves/received"),
  });
}

export function useSendWave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ receiverId, emoji }: { receiverId: string; emoji: "👋" | "🔥" }) =>
      api.post("/waves/send", { receiver_id: receiverId, emoji }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waves"] });
    },
  });
}

export function useRateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ratedId,
      conversationId,
      rating,
    }: {
      ratedId: string;
      conversationId: string;
      rating: number;
    }) =>
      api.post("/ratings", { ratee_id: ratedId, conversation_id: conversationId, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
