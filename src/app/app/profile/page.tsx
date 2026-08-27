"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMyProfile, useUpdateProfile, useUploadAvatar, useSwitchRole } from "@/hooks/queries";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout, Modal, Loader, Toast } from "@/components/layouts";
import { Button, Input, Card, Badge } from "@/components/ui";

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data: profile, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const switchRoleMutation = useSwitchRole();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    age: "",
    gender: "",
  });
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync({
        display_name: formData.display_name,
        bio: formData.bio,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
      });
      setEditMode(false);
      setToast({ message: "Profile updated!", type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Failed to update profile", type: "error" });
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      await uploadAvatarMutation.mutateAsync(e.target.files[0]);
      setToast({ message: "Avatar uploaded!", type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Failed to upload avatar", type: "error" });
    }
  };

  const handleSwitchRole = async (newRole: "member" | "host") => {
    try {
      await switchRoleMutation.mutateAsync(newRole);
      setToast({ message: `Switched to ${newRole} mode!`, type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Failed to switch role", type: "error" });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error: any) {
      setToast({ message: "Failed to sign out", type: "error" });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" text="Loading profile..." />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-300 rounded-lg overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-500 text-white text-3xl">
                  👤
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.display_name}
                </h1>
                {profile.is_online && (
                  <Badge variant="success">Online</Badge>
                )}
              </div>
              <p className="text-gray-600 mb-3">{profile.bio || "No bio yet"}</p>
              <div className="flex items-center gap-4 text-sm">
                {profile.age && (
                  <span className="text-gray-600">Age: {profile.age}</span>
                )}
                {profile.gender && (
                  <span className="text-gray-600">Gender: {profile.gender}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <label className="relative inline-block">
              <Button variant="secondary" size="sm" as="span">
                📷 Change Avatar
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                disabled={uploadAvatarMutation.isPending}
                className="hidden"
              />
            </label>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              ✏️ Edit Profile
            </Button>
          </div>
        </Card>

        {/* Edit Mode */}
        {editMode && (
          <Card>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Display Name"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
                required
              />

              <Input
                label="Bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself"
              />

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                min="18"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  isLoading={updateProfileMutation.isPending}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-primary-500">
              {profile.avg_rating.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Rating ({profile.rating_count})
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-primary-500">
              {profile.credit_balance}
            </p>
            <p className="text-sm text-gray-600 mt-1">Credits</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-primary-500">
              {profile.is_online ? "🟢" : "⚪"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {profile.is_online ? "Online" : "Offline"}
            </p>
          </Card>
        </div>

        {/* Role Selection */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Role</h2>
          <div className="flex gap-2">
            <Button
              variant={profile.is_online ? "primary" : "tertiary"}
              onClick={() => handleSwitchRole("member")}
              disabled={switchRoleMutation.isPending}
            >
              👤 Member
            </Button>
            <Button
              variant={profile.is_online ? "primary" : "tertiary"}
              onClick={() => handleSwitchRole("host")}
              disabled={switchRoleMutation.isPending}
            >
              🏠 Host
            </Button>
          </div>
        </Card>

        {/* Sign Out */}
        <Card>
          <Button
            variant="danger"
            fullWidth
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Card>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}