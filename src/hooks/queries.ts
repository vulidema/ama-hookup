import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, discoverService, conversationService } from "@/lib/services";

// Profile queries
export const useMyProfile = () => {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => profileService.getMyProfile(),
  });
};

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => profileService.getProfileById(id),
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: any) => profileService.updateMyProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export const useUpdateLocation = () => {
  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      profileService.updateLocation(lat, lng),
  });
};

export const useSwitchRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role: "member" | "host") => profileService.switchRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export const useSetOnlineStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isOnline: boolean) => profileService.setOnlineStatus(isOnline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

// Discover queries
export const useActiveHostsFeed = (lat: number, lng: number, radiusKm: number = 50) => {
  return useQuery({
    queryKey: ["discover", "hosts", lat, lng, radiusKm],
    queryFn: () => discoverService.getActiveHostsFeed(lat, lng, radiusKm),
    enabled: !!lat && !!lng,
  });
};

export const useSendChatRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hostId, introText }: { hostId: string; introText: string }) =>
      discoverService.sendChatRequest(hostId, introText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
};

export const useRespondToChatRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: "accept" | "decline" }) =>
      discoverService.respondToChatRequest(requestId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useMyChatRequests = () => {
  return useQuery({
    queryKey: ["chat", "requests"],
    queryFn: () => discoverService.getMyChatRequests(),
  });
};

export const useSendWave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ receiverId, emoji }: { receiverId: string; emoji: "👋" | "🔥" }) =>
      discoverService.sendWave(receiverId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waves"] });
    },
  });
};

export const useMyWaves = () => {
  return useQuery({
    queryKey: ["waves"],
    queryFn: () => discoverService.getMyWaves(),
  });
};

// Conversation queries
export const useMyConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => conversationService.getMyConversations(),
  });
};

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => conversationService.getConversationById(id),
    enabled: !!id,
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => conversationService.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 3000, // Poll every 3 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: string }) =>
      conversationService.sendMessage(conversationId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
    },
  });
};

export const useRateUser = () => {
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
    }) => conversationService.rateUser(ratedId, conversationId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
