import { Profile, UserRole } from "@/types";

export function useMyProfile() {
  // Placeholder
  return {
    data: null as Profile | null,
    isLoading: false,
  };
}

export function useProfile(id: string) {
  // Placeholder
  return {
    data: null as Profile | null,
    isLoading: false,
  };
}

export function useUpdateProfile() {
  return {
    mutateAsync: async (updates: Record<string, unknown>) => updates,
    isPending: false,
  };
}

export function useUploadAvatar() {
  return {
    mutateAsync: async (file: File) => ({}),
    isPending: false,
  };
}

export function useSwitchRole() {
  return {
    mutateAsync: async (role: UserRole) => ({}),
    isPending: false,
  };
}

export function useActiveHostsFeed(lat: number, lng: number, radiusKm = 50) {
  return {
    data: [] as Profile[],
    isLoading: false,
  };
}

export function useMyChatRequests() {
  return {
    data: [],
    isLoading: false,
  };
}

export function useRespondToChatRequest() {
  return {
    mutateAsync: async (data: { requestId: string; action: "accept" | "decline" }) => ({}),
    isPending: false,
  };
}

export function useConversation(id: string) {
  return {
    data: null,
    isLoading: false,
  };
}

export function useMessages(id: string) {
  return {
    data: [],
    isLoading: false,
  };
}

export function useSendMessage() {
  return {
    mutateAsync: async (data: { conversationId: string; body: string }) => ({}),
    isPending: false,
  };
}

export function useSetStatusMessage() {
  return {
    mutateAsync: async (message: string | null) => ({}),
    isPending: false,
  };
}
