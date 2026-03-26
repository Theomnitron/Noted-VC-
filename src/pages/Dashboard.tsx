import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  Container, 
  Paper, 
  Grid, 
  CircularProgress, 
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, Search, LayoutGrid, List, Menu, X as CloseIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../features/notes/hooks/useNotes';
import { NoteCard } from '../features/notes/components/NoteCard';
import { NoteEditor } from '../features/notes/components/NoteEditor';
import { SmartBackground } from '../components/SmartBackground';
import { ProfileSettings } from '../features/profile/components/ProfileSettings';

export const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleCreateNote = () => {
    createNote(undefined, {
      onSuccess: (newNote) => {
        setSelectedNoteId(newNote.id);
        setIsMobileMenuOpen(false);
      }
    });
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      if (selectedNoteId === id) setSelectedNoteId(null);
    }
  };

  const SidebarContent = () => (
    <Box sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      p: 3,
      bgcolor: 'background.paper'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Noted.</Typography>
        {isMobile && (
          <IconButton onClick={() => setIsMobileMenuOpen(false)} size="small">
            <CloseIcon size={20} />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={profile?.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} 
            sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'divider' }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {profile?.first_name} {profile?.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{profile?.username}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Profile Settings">
          <IconButton size="small" onClick={() => setIsProfileSettingsOpen(true)}>
            <Settings size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      <Button 
        variant="contained" 
        startIcon={<Plus size={18} />}
        fullWidth
        onClick={handleCreateNote}
        sx={{ mb: 4, py: 1.5, borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        New Note
      </Button>

      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.disabled', mb: 2, display: 'block' }}>
          Main
        </Typography>
      </Box>

      <Button 
        variant="text" 
        color="inherit" 
        startIcon={<LogOut size={18} />}
        onClick={signOut}
        sx={{ justifyContent: 'flex-start', opacity: 0.6, '&:hover': { opacity: 1, bgcolor: 'transparent' } }}
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      <SmartBackground />
      
      <ProfileSettings 
        open={isProfileSettingsOpen} 
        onClose={() => setIsProfileSettingsOpen(false)} 
      />
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box sx={{ 
          width: 280, 
          borderRight: '1px solid', 
          borderColor: 'divider', 
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 10
        }}>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton onClick={() => setIsMobileMenuOpen(true)} size="small">
                <Menu size={20} />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'action.hover', px: 2, py: 0.75, borderRadius: 2, width: { xs: 180, sm: 300 } }}>
              <Search size={16} style={{ opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary" noWrap>Search notes...</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small"><LayoutGrid size={18} /></IconButton>
            <IconButton size="small"><List size={18} /></IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 6 } }}>
          <Container maxWidth="lg">
            <AnimatePresence mode="wait">
              {selectedNote ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NoteEditor 
                    note={selectedNote}
                    onUpdate={(updates) => updateNote({ id: selectedNote.id, updates })}
                    onDelete={() => handleDeleteNote(selectedNote.id)}
                    onClose={() => setSelectedNoteId(null)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>My Notes</Typography>
                    {isMobile && (
                      <IconButton color="primary" onClick={handleCreateNote}>
                        <Plus size={24} />
                      </IconButton>
                    )}
                  </Box>
                  
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress size={32} />
                    </Box>
                  ) : notes.length > 0 ? (
                    <Grid container spacing={3}>
                      {notes.map((note, index) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={note.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <NoteCard 
                              note={note} 
                              onClick={() => setSelectedNoteId(note.id)}
                              onDelete={(e) => handleDeleteNote(note.id, e)}
                            />
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Paper sx={{ 
                      p: 8, 
                      textAlign: 'center', 
                      border: '2px dashed', 
                      borderColor: 'divider', 
                      bgcolor: 'transparent',
                      borderRadius: 4
                    }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>No notes yet</Typography>
                      <Typography color="text.secondary" sx={{ mb: 4 }}>Capture your thoughts and ideas in one place.</Typography>
                      <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleCreateNote}>
                        Create your first note
                      </Button>
                    </Paper>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
