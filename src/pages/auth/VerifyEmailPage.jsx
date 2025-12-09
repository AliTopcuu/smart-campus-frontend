import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/ErrorOutline';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Email doğrulanıyor...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Doğrulama tokenı bulunamadı.');
        return;
      }

      try {
        const response = await authService.verifyEmail({ token });
        setStatus('success');
        setMessage(response.message ?? 'Email adresiniz doğrulandı.');
      } catch (error) {
        setStatus('error');
        setMessage(getApiErrorMessage(error, 'Email doğrulanamadı.'));
      }
    };
    verify();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #064e3b 0%, #1e40af 50%, #3730a3 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(5, 150, 105, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Stack spacing={4} alignItems="center" textAlign="center">
            {/* Header Section */}
            <Box>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #059669 0%, #2563eb 50%, #4f46e5 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                Email Doğrulama
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: 'rgba(209, 213, 219, 0.8)',
                }}
              >
                Hesabınızı aktifleştiriyoruz
              </Typography>
            </Box>

            {/* Status Section */}
            <Box sx={{ py: 2 }}>
              {status === 'loading' && (
                <CircularProgress
                  size={64}
                  sx={{
                    color: '#2563eb',
                  }}
                />
              )}
              {status === 'success' && (
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: '#10b981',
                  }}
                />
              )}
              {status === 'error' && (
                <ErrorIcon
                  sx={{
                    fontSize: 80,
                    color: '#ef4444',
                  }}
                />
              )}
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: '#f3f4f6',
                fontWeight: 600,
                mb: 2,
              }}
            >
              {message}
            </Typography>

            {status === 'success' && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/login', { replace: true })}
                sx={{
                  background: 'linear-gradient(135deg, #059669 0%, #2563eb 50%, #4f46e5 100%)',
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #047857 0%, #1d4ed8 50%, #4338ca 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Giriş Yap
              </Button>
            )}

            {status === 'error' && (
              <Stack spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(209, 213, 219, 0.8)',
                    maxWidth: '400px',
                  }}
                >
                  Token süresi dolduysa veya geçersizse, lütfen tekrar kayıt olmayı deneyin.
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderColor: 'rgba(75, 85, 99, 0.5)',
                    color: '#f3f4f6',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    },
                  }}
                >
                  Tekrar Kayıt Ol
                </Button>
                <MuiLink
                  component={Link}
                  to="/login"
                  underline="hover"
                  sx={{
                    color: '#3b82f6',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#6366f1',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  Giriş sayfasına dön
                </MuiLink>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
