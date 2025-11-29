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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

const EducationManager = () => {
  const queryClient = useQueryClient();
  const { data: education = [] } = useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data } = await API.get("/education");
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
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: "",
      logoUrl: "",
      location: "",
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      const { id, logoUrl, ...rest } = values;
      const payload = {
        ...rest,
        logo: logoUrl ? { url: logoUrl } : undefined,
      };
      if (id) {
        return API.put(`/education/${id}`, payload);
      }
      return API.post("/education", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/education/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });

  const handleEdit = (item) => {
    setValue("id", item._id);
    setValue("institution", item.institution);
    setValue("degree", item.degree);
    setValue("fieldOfStudy", item.fieldOfStudy || "");
    setValue("startDate", item.startDate?.slice(0, 10) || "");
    setValue("endDate", item.endDate?.slice(0, 10) || "");
    setValue("grade", item.grade || "");
    setValue("description", item.description || "");
    setValue("logoUrl", item.logo?.url || "");
    setValue("location", item.location || "");
  };

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

  const logoUrl = watch("logoUrl");

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Education Manager
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {watch("id") ? "Edit Education" : "Add Education"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}
        >
          <TextField label="Institution" {...register("institution", { required: true })} />
          <TextField label="Degree" {...register("degree", { required: true })} />
          <TextField label="Field of study" {...register("fieldOfStudy")} />
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
          <TextField label="Grade (Optional)" {...register("grade")} />

          <Box sx={{ gridColumn: "1/-1", display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2">Institution Logo</Typography>
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
            label="Description"
            {...register("description")}
            multiline
            rows={3}
            sx={{ gridColumn: "1/-1" }}
          />
          <Box sx={{ gridColumn: "1/-1", display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting || upsertMutation.isLoading}
            >
              {watch("id") ? "Update Education" : "Add Education"}
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
              <TableCell>Institution</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {education.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.institution}</TableCell>
                <TableCell>{item.degree}</TableCell>
                <TableCell>{item.fieldOfStudy}</TableCell>
                <TableCell>{item.grade}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (window.confirm("Delete this record?")) {
                        deleteMutation.mutate(item._id);
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

export default EducationManager;

