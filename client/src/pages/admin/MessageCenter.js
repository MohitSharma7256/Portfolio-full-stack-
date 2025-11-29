import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { MarkEmailRead, Reply, Delete } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

const MessageCenter = () => {
  const queryClient = useQueryClient();
  const [activeMessage, setActiveMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const { data: messages = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await API.get("/messages");
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => API.put(`/messages/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, response }) => API.post(`/messages/${id}/reply`, { response }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setActiveMessage(null);
      setReplyText("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/messages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const handleReply = () => {
    if (!activeMessage || !replyText.trim()) return;
    replyMutation.mutate({ id: activeMessage._id, response: replyText });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message._id} hover>
                <TableCell>{message.subject}</TableCell>
                <TableCell>
                  {message.name} ({message.email})
                </TableCell>
                <TableCell>
                  {new Date(message.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{message.isRead ? "Read" : "Unread"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => markReadMutation.mutate(message._id)}>
                    <MarkEmailRead />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setActiveMessage(message);
                      setReplyText("");
                    }}
                  >
                    <Reply />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      if (window.confirm("Delete this message?")) {
                        deleteMutation.mutate(message._id);
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={Boolean(activeMessage)} onClose={() => setActiveMessage(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to {activeMessage?.name}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            {activeMessage?.subject}
          </Typography>
          <Typography variant="body2" paragraph>
            {activeMessage?.body}
          </Typography>
          <TextField
            label="Your reply"
            multiline
            rows={4}
            fullWidth
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveMessage(null)}>Close</Button>
          <Button onClick={handleReply} variant="contained" disabled={replyMutation.isLoading}>
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageCenter;

