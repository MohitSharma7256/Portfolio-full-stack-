import React, { useEffect } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

const ProfileManager = () => {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await API.get("/profile");
      return data;
    },
  });

  const [uploading, setUploading] = React.useState(false);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Assuming the server returns { url: "..." } or similar
      // Adjust based on your actual upload response structure
      // If it returns the full path, use it. If relative, prepend server URL if needed.
      // For now assuming it returns the URL directly or in a property.
      const imageUrl = data.url || data.filePath || data;

      // Update the form value for heroImageUrl
      setValue('heroImageUrl', imageUrl);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // We need setValue from useForm
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      headline: "",
      bio: "",
      roles: "Full Stack Developer",
      location: "",
      email: "",
      phone: "",
      availability: "",
      heroImageUrl: "",
      resumeIntro: "",
      ctaLabel: "",
    },
  });

  // Watch heroImageUrl to display preview if needed
  const heroImageUrl = watch("heroImageUrl");

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        roles: (profile.roles || []).join("\n"),
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        availability: profile.availability,
        heroImageUrl: profile.heroImage?.url || "",
        resumeIntro: profile.resumeIntro,
        ctaLabel: profile.ctaLabel,
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values) =>
      API.put("/profile", {
        ...values,
        roles: values.roles
          ? values.roles.split("\n").map((role) => role.trim()).filter(Boolean)
          : [],
        heroImage: values.heroImageUrl ? { url: values.heroImageUrl } : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      alert("Profile updated successfully!");
    }
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile / About
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}
        >
          <TextField
            label="Name"
            placeholder="e.g. John Doe"
            {...register("name", { required: true })}
          />
          <TextField
            label="Headline"
            placeholder="e.g. Full Stack Developer | UI/UX Designer"
            {...register("headline")}
          />
          <TextField
            label="Location"
            placeholder="e.g. San Francisco, CA"
            {...register("location")}
          />
          <TextField
            label="Availability"
            placeholder="e.g. Open to work"
            {...register("availability")}
          />
          <TextField
            label="Email"
            placeholder="e.g. john@example.com"
            {...register("email")}
          />
          <TextField
            label="Phone"
            placeholder="e.g. +1 234 567 890"
            {...register("phone")}
          />

          {/* Image Upload Section */}
          <Box sx={{ gridColumn: "1/-1", display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2">Hero Image</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="outlined" component="label">
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" hidden accept="image/*" onChange={onFileChange} />
              </Button>
              {heroImageUrl && (
                <Box
                  component="img"
                  src={heroImageUrl}
                  alt="Hero Preview"
                  sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                />
              )}
              <TextField
                label="Image URL"
                placeholder="Or enter image URL directly"
                {...register("heroImageUrl")}
                sx={{ flexGrow: 1 }}
                size="small"
              />
            </Box>
          </Box>

          <TextField
            label="Roles (one per line)"
            placeholder="Full Stack Developer&#10;UI Designer&#10;Freelancer"
            {...register("roles")}
            multiline
            rows={4}
            sx={{ gridColumn: "1/-1" }}
          />
          <TextField
            label="Bio"
            placeholder="Write a short bio about yourself..."
            {...register("bio")}
            multiline
            rows={4}
            sx={{ gridColumn: "1/-1" }}
          />
          <TextField
            label="Resume intro"
            placeholder="Brief introduction text for your resume section..."
            {...register("resumeIntro")}
            multiline
            rows={3}
            sx={{ gridColumn: "1/-1" }}
          />
          <TextField
            label="CTA label"
            placeholder="e.g. Check Resume"
            {...register("ctaLabel")}
          />
          <Box sx={{ gridColumn: "1/-1", display: "flex", gap: 2 }}>
            <Button variant="contained" type="submit" disabled={mutation.isLoading || uploading}>
              {mutation.isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box >
  );
};

export default ProfileManager;

