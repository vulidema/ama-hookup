import { useMyProfile } from "./queries";
import { useEffect, useState } from "react";

export function useAdmin() {
  const { data: profile, isLoading } = useMyProfile();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.role === "admin" || profile.role === "superadmin");
    }
  }, [profile]);

  return {
    isAdmin,
    loading: isLoading,
    profile,
  };
}
