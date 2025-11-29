import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

const ExperienceManager = () => {
  const queryClient = useQueryClient();
  const { data: experiences = [] } = useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data } = await API.get("/experience");
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      id: null,
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      durationLabel: "",
      isCurrent: false,
      responsibilities: "",
      technologies: "",
      logoUrl: "",
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      const { id, responsibilities, technologies, logoUrl, ...rest } = values;
      const payload = {
        ...rest,
        responsibilities: responsibilities
          ? responsibilities.split("\n").map((item) => item.trim()).filter(Boolean)
          : [],
        technologies: technologies
          ? technologies.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        logo: logoUrl ? { url: logoUrl } : undefined,
      };
      if (id) {
        return API.put(`/experience/${id}`, payload);
      }
      return API.post("/experience", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/experience/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
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
      const imageUrl = data.url || data.filePath || data;
      setValue("logoUrl", imageUrl);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (values) => {
    upsertMutation.mutate(values);
  };

  const handleEdit = (exp) => {
    setValue("id", exp._id);
    setValue("company", exp.company);
    setValue("role", exp.role);
    setValue("location", exp.location || "");
    setValue("startDate", exp.startDate?.slice(0, 10) || "");
    setValue("endDate", exp.endDate?.slice(0, 10) || "");
    setValue("durationLabel", exp.durationLabel || "");
    setValue("isCurrent", exp.isCurrent);
    setValue("responsibilities", (exp.responsibilities || []).join("\n"));
    setValue("technologies", (exp.technologies || []).join(", "));
    setValue("logoUrl", exp.logo?.url || "");
  };

  const logoUrl = watch("logoUrl");

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Experience Manager
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {watch("id") ? "Edit Experience" : "Add Experience"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}
        >
          <TextField label="Company" {...register("company", { required: true })} />
          <TextField label="Role" {...register("role", { required: true })} />
          <TextField label="Location" {...register("location")} />
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("startDate", { required: true })}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("endDate")}
          />
          <TextField label="Duration Label" {...register("durationLabel")} />

          <Box sx={{ gridColumn: "1/-1", display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2">Company Logo</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="outlined" component="label">
                {uploading ? "Uploading..." : "Upload Logo"}
                <input type="file" hidden accept="image/*" onChange={onFileChange} />
              </Button>
              {logoUrl && (
                <Box
                  component="img"
                  src={logoUrl}
                  alt="Logo Preview"
                  sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 1, border: '1px solid #ddd' }}
                />
              )}
              <TextField
                label="Logo URL"
                placeholder="Or enter URL directly"
                {...register("logoUrl")}
                sx={{ flexGrow: 1 }}
                size="small"
              />
            </Box>
          </Box>
          <TextField
            label="Technologies (comma separated)"
            {...register("technologies")}
            fullWidth
          />
          <TextField
            label="Responsibilities (one per line)"
            {...register("responsibilities")}
            multiline
            rows={4}
            fullWidth
          />
          <Box sx={{ gridColumn: "1/-1" }}>
            <FormControlLabel
              control={<Checkbox {...register("isCurrent")} checked={watch("isCurrent")} />}
              label="Currently working"
            />
          </Box>
          <Box sx={{ gridColumn: "1/-1", display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting || upsertMutation.isLoading}
            >
              {watch("id") ? "Update Experience" : "Add Experience"}
            </Button>
            {watch("id") && (
              <Button variant="text" onClick={() => reset()}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Technologies</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiences.map((exp) => (
              <TableRow key={exp._id}>
                <TableCell>{exp.company}</TableCell>
                <TableCell>{exp.role}</TableCell>
                <TableCell>{exp.durationLabel}</TableCell>
                <TableCell>{(exp.technologies || []).join(", ")}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(exp)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (window.confirm("Delete this experience?")) {
                        deleteMutation.mutate(exp._id);
                      }
                    }}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ExperienceManager;

