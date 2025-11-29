import React, { useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

const ResumeManager = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: resume, isLoading, error } = useQuery({
    queryKey: ["resumeMeta"],
    queryFn: async () => {
      const { data } = await API.get("/resume");
      return data;
    },
    retry: false,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await API.post("/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumeMeta"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/resume/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumeMeta"] });
    },
  });

  const handleUpload = () => {
    const file = fileInputRef.current.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
    fileInputRef.current.value = "";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Resume Manager
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload New Resume
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" />
          <Button variant="contained" onClick={handleUpload} disabled={uploadMutation.isLoading}>
            Upload
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Current Resume</Typography>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">No resume found.</Typography>
        ) : resume ? (
          <>
            <List>
              <ListItem>
                <ListItemText
                  primary="File name"
                  secondary={resume.fileName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Downloads"
                  secondary={resume.downloadCount}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last updated"
                  secondary={new Date(resume.updatedAt).toLocaleString()}
                />
              </ListItem>
            </List>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (window.confirm("Delete current resume?")) {
                  deleteMutation.mutate(resume._id);
                }
              }}
            >
              Delete Resume
            </Button>
          </>
        ) : (
          <Typography>No resume uploaded yet.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ResumeManager;

