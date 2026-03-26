import React, { memo } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Trash2, FileText } from 'lucide-react';
import { Note } from '../services/notesService';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  isActive?: boolean;
}

export const NoteCard = memo(({ note, onClick, onDelete, isActive }: NoteCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        onClick={onClick}
        sx={{ 
          cursor: 'pointer',
          height: '100%',
          border: '1px solid',
          borderColor: isActive ? 'primary.main' : 'divider',
          bgcolor: isActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease',
          position: 'relative',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
          }
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
              <FileText size={18} />
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Note
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={onDelete}
              sx={{ 
                opacity: 0, 
                '.MuiCard-root:hover &': { opacity: 0.5 },
                '&:hover': { opacity: '1 !important', color: 'error.main' }
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Box>
          
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineClamp: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {note.title || 'Untitled'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '4.5em' }}>
            {note.content || 'No content...'}
          </Typography>
          
          <Typography variant="caption" color="text.disabled" sx={{ mt: 2, display: 'block' }}>
            {new Date(note.updated_at).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
});
