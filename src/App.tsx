import { BrowserRouter as Router, Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { useThemeContext } from './context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { HeroVisual } from './components/HeroVisual';
import { motion } from 'framer-motion';
import { Login } from './features/auth/Login';
import { SignUp } from './features/auth/SignUp';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const LandingPage = () => {
  const { mode, toggleTheme } = useThemeContext();
  const { user } = useAuth();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: 'background.default',
      color: 'text.primary',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', py: 8 }}>
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" sx={{ fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 900, letterSpacing: '-0.02em', mb: 2 }}>
              Noted.
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, opacity: 0.7, maxWidth: '500px', mx: { xs: 'auto', md: 0 } }}>
              The smart, minimal note-taking experience designed for modern productivity.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {user ? (
                <Button component={RouterLink} to="/dashboard" variant="contained" size="large" sx={{ py: 2, px: 4, fontSize: '1.1rem' }}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button component={RouterLink} to="/signup" variant="contained" size="large" sx={{ py: 2, px: 4, fontSize: '1.1rem' }}>
                    Start Writing
                  </Button>
                  <Button component={RouterLink} to="/login" variant="outlined" size="large" sx={{ py: 2, px: 4, fontSize: '1.1rem' }}>
                    Sign In
                  </Button>
                </>
              )}
              <Button 
                variant="text" 
                size="large"
                onClick={toggleTheme}
                sx={{ minWidth: 0, p: 2 }}
              >
                {mode === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </Button>
            </Box>
          </motion.div>
        </Box>
        
        <Box sx={{ flex: 1, width: '100%', height: { xs: '300px', md: '500px' } }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ width: '100%', height: '100%' }}
          >
            <HeroVisual />
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
