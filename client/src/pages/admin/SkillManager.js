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
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

const iconPresets = [
  { label: "Material UI", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" },
  { label: "Bootstrap", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
  { label: "Tailwind", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { label: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
];

const SkillManager = () => {
  const queryClient = useQueryClient();
  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await API.get("/skills");
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
      name: "",
      category: "",
      level: 80,
      iconUrl: "",
      isFeatured: false,
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (payload) => {
      const { id, ...rest } = payload;
      const body = {
        ...rest,
        level: Number(rest.level),
        icon: rest.iconUrl ? { url: rest.iconUrl } : undefined,
      };
      if (id) {
        return API.put(`/skills/${id}`, body);
      }
      return API.post("/skills", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const onSubmit = (values) => {
    upsertMutation.mutate(values);
  };

  const handleEdit = (skill) => {
    setValue("id", skill._id);
    setValue("name", skill.name);
    setValue("category", skill.category);
    setValue("level", skill.level);
    setValue("iconUrl", skill.icon?.url || "");
    setValue("isFeatured", skill.isFeatured);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this skill?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Skill Manager
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {watch("id") ? "Edit Skill" : "Add Skill"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
        >
          <TextField
            label="Skill name"
            {...register("name", { required: true })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            label="Category"
            {...register("category", { required: true })}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            type="number"
            label="Level (0-100)"
            {...register("level", { valueAsNumber: true })}
            sx={{ width: 150 }}
          />
          <TextField
            label="Icon URL"
            {...register("iconUrl")}
            helperText="Paste any icon URL or use a preset below."
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 1 }}>
            {iconPresets.map((preset) => (
              <Chip
                key={preset.label}
                label={preset.label}
                onClick={() => setValue("iconUrl", preset.url, { shouldDirty: true })}
                variant="outlined"
              />
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting || upsertMutation.isLoading}
          >
            {watch("id") ? "Update Skill" : "Add Skill"}
          </Button>
          {watch("id") && (
            <Button variant="text" onClick={() => reset()}>
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill._id}>
                <TableCell>{skill.name}</TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell>{skill.level}</TableCell>
                <TableCell>
                  {skill.icon?.url && (
                    <img
                      src={skill.icon.url}
                      alt={skill.name}
                      width={32}
                      height={32}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(skill)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(skill._id)} color="error">
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

export default SkillManager;

