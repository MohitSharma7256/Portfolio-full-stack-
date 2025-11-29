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

const SocialManager = () => {
  const queryClient = useQueryClient();
  const { data: socialLinks = [] } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      const { data } = await API.get("/social");
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
      platform: "",
      url: "",
      icon: "",
      order: 0,
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (values) => {
      const { id, ...payload } = values;
      payload.order = Number(payload.order);
      if (id) {
        return API.put(`/social/${id}`, payload);
      }
      return API.post("/social", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/social/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
    },
  });

  const handleEdit = (link) => {
    setValue("id", link._id);
    setValue("platform", link.platform);
    setValue("url", link.url);
    setValue("icon", link.icon || "");
    setValue("order", link.order || 0);
  };

  const onSubmit = (values) => {
    upsertMutation.mutate(values);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Social Links
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", gap: 2 }}>
          <TextField label="Platform" {...register("platform", { required: true })} />
          <TextField label="URL" {...register("url", { required: true })} sx={{ flex: 1 }} />
          <TextField label="Icon (optional)" {...register("icon")} />
          <TextField
            label="Order"
            type="number"
            {...register("order", { valueAsNumber: true })}
            sx={{ width: 100 }}
          />
          <Button variant="contained" type="submit" disabled={isSubmitting || upsertMutation.isLoading}>
            {watch("id") ? "Update" : "Add"}
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
              <TableCell>Platform</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Order</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {socialLinks.map((link) => (
              <TableRow key={link._id}>
                <TableCell>{link.platform}</TableCell>
                <TableCell>{link.url}</TableCell>
                <TableCell>{link.order}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(link)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (window.confirm("Delete this social link?")) {
                        deleteMutation.mutate(link._id);
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

export default SocialManager;

