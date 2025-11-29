import React, { useState, useRef } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

const ProjectManager = () => {
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery({
    queryKey: ["adminProjects"],
    queryFn: async () => {
      const { data } = await API.get("/projects/admin/all");
      return data;
    },
  });
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    tech: "",
    images: "",
    demoUrl: "",
    repoUrl: "",
    isPublic: true,
  });

  const handleOpen = (project = null) => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        features: (project.features || []).join("\n"),
        tech: (project.tech || []).join(", "),
        images: (project.images || []).map((img) => img.url).join("\n"),
        demoUrl: project.demoUrl || "",
        repoUrl: project.repoUrl || "",
        isPublic: project.isPublic,
      });
      setEditingProject(project._id);
    } else {
      setFormData({
        title: "",
        description: "",
        features: "",
        tech: "",
        images: "",
        demoUrl: "",
        repoUrl: "",
        isPublic: true,
      });
      setEditingProject(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const upsertMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingProject) {
        return API.put(`/projects/${editingProject}`, payload);
      }
      return API.post("/projects", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminProjects"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      tech: formData.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: formData.images
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url) => ({ url })),
    };
    upsertMutation.mutate(payload);
  };

  const handleTriggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}\n${data.url}` : data.url,
      }));
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Project Management
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Project
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Technologies</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{(project.tech || []).join(", ")}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      backgroundColor: project.isPublic ? "#e8f5e9" : "#fff3e0",
                      color: project.isPublic ? "#2e7d32" : "#e65100",
                      fontWeight: "500",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {project.isPublic ? "Public" : "Draft"}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(project)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Project Title"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="features"
              label="Features (one per line)"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.features}
              onChange={handleChange}
              helperText="Enter one feature per line"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="tech"
              label="Technologies (comma separated)"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.tech}
              onChange={handleChange}
              helperText="e.g., React, Node.js, MongoDB"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="images"
              label="Image URLs (one per line)"
              type="text"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={formData.images}
              onChange={handleChange}
              helperText="Upload assets via the button below or paste secure URLs from Cloudinary/S3."
              sx={{ mb: 2 }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
            <Button
              variant="outlined"
              onClick={handleTriggerImageUpload}
              disabled={uploadingImage}
              sx={{ mb: 2 }}
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </Button>
            <TextField
              margin="dense"
              name="demoUrl"
              label="Demo URL"
              type="url"
              fullWidth
              variant="outlined"
              value={formData.demoUrl}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="repoUrl"
              label="Repository URL"
              type="url"
              fullWidth
              variant="outlined"
              value={formData.repoUrl}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                style={{ marginRight: "8px" }}
              />
              <label htmlFor="isPublic">Make this project public</label>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained" disabled={upsertMutation.isLoading}>
              {editingProject ? "Update" : "Create"} Project
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ProjectManager;