import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
  Paper,
  Divider,
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginSchema } from '@/utils/validationSchemas';
import { useToast } from '@/hooks/useToast';
import { getApiErrorMessage } from '@/utils/apiError';
import { appConfig } from '@/config/appConfig';

export const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe || false,
      });
      toast.success('Hoş geldiniz!');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #065f46 0%, #1e3a8a 50%, #312e81 100%)',
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
          background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
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
          <Stack spacing={4}>
            {/* Header Section */}
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #6366f1 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                Hoş Geldiniz
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 500,
                  color: 'rgba(209, 213, 219, 0.8)',
                }}
              >
                {appConfig.appName} hesabınıza giriş yapın
              </Typography>
            </Box>

            {/* Form Section */}
            <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="E-posta"
                    type="email"
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: alpha('#1f2937', 0.8),
                        color: '#f3f4f6',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          borderColor: 'rgba(75, 85, 99, 0.5)',
                        },
                        '&:hover': {
                          backgroundColor: '#1f2937',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          '& fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.5)',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#1f2937',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          '& fieldset': {
                            borderColor: '#3b82f6',
                          },
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(209, 213, 219, 0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3b82f6',
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgba(209, 213, 219, 0.6)',
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Şifre"
                    type="password"
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: alpha('#1f2937', 0.8),
                        color: '#f3f4f6',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          borderColor: 'rgba(75, 85, 99, 0.5)',
                        },
                        '&:hover': {
                          backgroundColor: '#1f2937',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          '& fieldset': {
                            borderColor: 'rgba(59, 130, 246, 0.5)',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#1f2937',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          '& fieldset': {
                            borderColor: '#3b82f6',
                          },
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(209, 213, 219, 0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3b82f6',
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgba(209, 213, 219, 0.6)',
                      },
                    }}
                  />
                )}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: '#3b82f6',
                            '&.Mui-checked': {
                              color: '#6366f1',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: 'rgba(209, 213, 219, 0.9)',
                          }}
                        >
                          Beni hatırla
                        </Typography>
                      }
                    />
                  )}
                />
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  underline="hover"
                  sx={{
                    color: '#60a5fa',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#818cf8',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  Şifremi Unuttum?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #6366f1 100%)',
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #2563eb 50%, #4f46e5 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #6366f1 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </Stack>

            <Divider sx={{ my: 1, borderColor: 'rgba(75, 85, 99, 0.3)' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  px: 2,
                  color: 'rgba(209, 213, 219, 0.6)',
                }}
              >
                veya
              </Typography>
            </Divider>

            <Typography 
              textAlign="center" 
              sx={{ 
                fontSize: '0.95rem',
                color: 'rgba(209, 213, 219, 0.8)',
              }}
            >
              Hesabınız yok mu?{' '}
              <MuiLink
                component={Link}
                to="/register"
                underline="hover"
                sx={{
                  color: '#60a5fa',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#818cf8',
                    transform: 'translateX(2px)',
                  },
                }}
              >
                Hemen kayıt olun
              </MuiLink>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
