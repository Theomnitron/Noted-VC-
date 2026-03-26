import React, { useState, useEffect, memo } from 'react';
import { Box, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import { Note } from '../services/notesService';
import { Save, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const NoteEditor = memo(({ note, onUpdate, onDelete, onClose }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when note prop changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  // Debounced autosave
  useEffect(() => {
    if (title === note.title && content === note.content) return;

    setIsSaving(true);
    const timeout = setTimeout(() => {
      onUpdate({ title, content });
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [title, content, note.title, note.content, onUpdate]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
          <AnimatePresence>
            {isSaving && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Save size={12} /> Saving...
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <Tooltip title="Delete Note">
          <IconButton onClick={onDelete} color="error" size="small">
            <Trash2 size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        variant="standard"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        InputProps={{
          disableUnderline: true,
          sx: { fontSize: '2.5rem', fontWeight: 800, mb: 2 }
        }}
      />

      <TextField
        fullWidth
        multiline
        variant="standard"
        placeholder="Start writing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        InputProps={{
          disableUnderline: true,
          sx: { fontSize: '1.1rem', lineHeight: 1.6, flex: 1 }
        }}
        sx={{ flex: 1, '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } }}
      />
    </Box>
  );
});
