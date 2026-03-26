import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box sx={{ mt: 12, textAlign: 'center' }}>
            <Paper elevation={0} sx={{ p: 6, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
              <AlertTriangle size={48} color="#ff4444" style={{ marginBottom: '24px' }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
                Something went wrong
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                An unexpected error occurred. We've been notified and are looking into it.
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshCw size={18} />}
                onClick={this.handleReset}
                sx={{ py: 1.5, px: 4 }}
              >
                Reload Application
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
