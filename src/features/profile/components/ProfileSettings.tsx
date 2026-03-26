import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Avatar, 
  IconButton, 
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Camera, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { profileService } from '../services/profileService';

interface ProfileSettingsProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileSettings = ({ open, onClose }: ProfileSettingsProps) => {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    username: profile?.username || '',
    avatarUrl: profile?.profile_image_url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    setError(null);
    try {
      const url = await profileService.uploadAvatar(user.id, file);
      setFormData(prev => ({ ...prev, avatarUrl: url }));
    } catch (err: any) {
      setError('Failed to upload image. Make sure the "avatars" bucket exists in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await profileService.updateProfile(user.id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        profile_image_url: formData.avatarUrl,
      });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Profile Settings
        <IconButton onClick={onClose} size="small"><X size={20} /></IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`}
                sx={{ width: 100, height: 100, border: '4px solid', borderColor: 'divider' }}
              />
              <IconButton 
                onClick={() => fileInputRef.current?.click()}
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
                size="small"
              >
                <Camera size={16} />
              </IconButton>
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
              />
            </Box>
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
              Click to change photo
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}

          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
