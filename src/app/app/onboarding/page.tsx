"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMyProfile, useUpdateProfile, useUpdateLocation } from "@/hooks/queries";
import { AuthLayout } from "@/components/layouts";
import { Button, Input, Textarea } from "@/components/ui";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: profile } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateLocationMutation = useUpdateLocation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    age: "",
    gender: "",
  });
  const [locationStatus, setLocationStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if profile is already onboarded
  useEffect(() => {
    if (profile?.onboarded) {
      router.push("/app/discover");
    }
  }, [profile, router]);

  const handleProfileStep = async () => {
    setError("");
    setLoading(true);

    if (!formData.display_name.trim()) {
      setError("Display name is required");
      setLoading(false);
      return;
    }

    if (!formData.age || parseInt(formData.age) < 18) {
      setError("You must be at least 18 years old");
      setLoading(false);
      return;
    }

    if (!formData.gender) {
      setError("Please select your gender");
      setLoading(false);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        display_name: formData.display_name,
        bio: formData.bio,
        age: parseInt(formData.age),
        gender: formData.gender,
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationStep = async () => {
    setError("");
    setLoading(true);
    setLocationStatus("Getting your location...");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await updateLocationMutation.mutateAsync({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("Location saved!");
          setTimeout(() => router.push("/app/discover"), 1500);
        } catch (err: any) {
          setError(err.message || "Failed to save location");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Unable to access your location. Please enable location services.");
        setLoading(false);
      }
    );
  };

  const handleSkipLocation = () => {
    router.push("/app/discover");
  };

  return (
    <AuthLayout title="Complete Your Profile" subtitle="Let's get you started">
      {step === 1 ? (
        // Step 1: Profile Info
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProfileStep();
          }}
          className="space-y-4"
        >
          <Input
            label="Display Name *"
            placeholder="What should we call you?"
            value={formData.display_name}
            onChange={(e) =>
              setFormData({ ...formData, display_name: e.target.value })
            }
            disabled={loading}
            required
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself (optional)"
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            disabled={loading}
            maxLength={500}
          />
          <p className="text-xs text-gray-500">
            {formData.bio.length}/500 characters
          </p>

          <Input
            label="Age *"
            type="number"
            placeholder="Must be 18+"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            disabled={loading}
            min="18"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            Next: Add Location
          </Button>
        </form>
      ) : (
        // Step 2: Location
        <div className="space-y-4 text-center">
          <div className="py-8">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Add Your Location
            </h3>
            <p className="text-gray-600 text-sm">
              This helps us find people near you. We'll keep it private.
            </p>
          </div>

          {locationStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              {locationStatus}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              fullWidth
              size="lg"
              onClick={handleLocationStep}
              isLoading={loading}
              disabled={loading}
            >
              📍 Enable Location
            </Button>
            <Button
              variant="tertiary"
              fullWidth
              size="lg"
              onClick={handleSkipLocation}
              disabled={loading}
            >
              Skip for Now
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
