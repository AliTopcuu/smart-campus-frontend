import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  Divider,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '@/utils/validationSchemas';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { getApiErrorMessage } from '@/utils/apiError';
import { appConfig } from '@/config/appConfig';

const departmentOptions = [
  { value: 'computer-engineering', label: 'Bilgisayar Mühendisliği' },
  { value: 'electrical-engineering', label: 'Elektrik-Elektronik Müh.' },
  { value: 'industrial-engineering', label: 'Endüstri Müh.' },
  { value: 'business', label: 'İşletme' },
  { value: 'economics', label: 'İktisat' },
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      department: '',
      studentNumber: '',
      termsAccepted: false,
    },
  });

  const role = watch('role');

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const responseMessage = await registerUser(values);
      toast.success(responseMessage ?? 'Kayıt başarılı! Lütfen emailinizi doğrulayın.');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonTextFieldStyles = {
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
  };

  const commonSelectStyles = {
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
          borderColor: 'rgba(37, 99, 235, 0.5)',
        },
      },
      '&.Mui-focused': {
        backgroundColor: '#1f2937',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        '& fieldset': {
          borderColor: '#2563eb',
        },
      },
    },
    '& .MuiSelect-select': {
      backgroundColor: 'transparent !important',
      color: '#f3f4f6',
    },
    '& .MuiSelect-icon': {
      color: 'rgba(209, 213, 219, 0.7)',
      transition: 'color 0.2s ease',
    },
    '&:hover .MuiSelect-icon': {
      color: '#2563eb',
    },
    '&.Mui-focused .MuiSelect-icon': {
      color: '#2563eb',
    },
  };

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
          <Stack spacing={4}>
            {/* Header Section */}
            <Box textAlign="center">
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
                Hesap Oluştur
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 500,
                  color: 'rgba(209, 213, 219, 0.8)',
                }}
              >
                {appConfig.appName} ailesine katılın
              </Typography>
            </Box>

            {/* Form Section */}
            <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ad Soyad"
                        fullWidth
                        error={Boolean(errors.fullName)}
                        helperText={errors.fullName?.message}
                        sx={commonTextFieldStyles}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
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
                        sx={commonTextFieldStyles}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
                        sx={commonTextFieldStyles}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Şifre Tekrar"
                        type="password"
                        fullWidth
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword?.message}
                        sx={commonTextFieldStyles}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={Boolean(errors.role)}>
                    <InputLabel id="role-label" sx={{ color: 'rgba(209, 213, 219, 0.7)' }}>
                      Kullanıcı Tipi
                    </InputLabel>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="role-label"
                          id="role"
                          label="Kullanıcı Tipi"
                          sx={commonSelectStyles}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                backgroundColor: '#1f2937',
                                color: '#f3f4f6',
                                '& .MuiMenuItem-root': {
                                  color: '#f3f4f6',
                                  '&:hover': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                  },
                                  '&.Mui-selected': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(59, 130, 246, 0.4)',
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        >
                          <MenuItem value="student">Öğrenci</MenuItem>
                          <MenuItem value="faculty">Akademisyen</MenuItem>
                        </Select>
                      )}
                    />
                    <FormHelperText sx={{ color: 'rgba(209, 213, 219, 0.6)' }}>
                      {errors.role?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={Boolean(errors.department)}>
                    <InputLabel id="department-label" sx={{ color: 'rgba(209, 213, 219, 0.7)' }}>
                      Bölüm
                    </InputLabel>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="department-label"
                          id="department"
                          label="Bölüm"
                          sx={commonSelectStyles}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                backgroundColor: '#1f2937',
                                color: '#f3f4f6',
                                '& .MuiMenuItem-root': {
                                  color: '#f3f4f6',
                                  '&:hover': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                  },
                                  '&.Mui-selected': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(59, 130, 246, 0.4)',
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {departmentOptions.map((department) => (
                            <MenuItem key={department.value} value={department.value}>
                              {department.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    <FormHelperText sx={{ color: 'rgba(209, 213, 219, 0.6)' }}>
                      {errors.department?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {role === 'student' && (
                  <Grid item xs={12}>
                    <Controller
                      name="studentNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Öğrenci Numarası"
                          fullWidth
                          error={Boolean(errors.studentNumber)}
                          helperText={errors.studentNumber?.message}
                          sx={commonTextFieldStyles}
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>

              <Controller
                name="termsAccepted"
                control={control}
                render={({ field }) => (
                  <FormControl error={Boolean(errors.termsAccepted)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: '#2563eb',
                            '&.Mui-checked': {
                              color: '#4f46e5',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography 
                          component="span"
                          sx={{
                            color: 'rgba(209, 213, 219, 0.9)',
                          }}
                        >
                          Kullanım şartlarını okudum ve kabul ediyorum.
                        </Typography>
                      }
                    />
                    <FormHelperText sx={{ color: 'rgba(209, 213, 219, 0.6)' }}>
                      {errors.termsAccepted?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
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
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #059669 0%, #2563eb 50%, #4f46e5 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                {isSubmitting ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
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
              Zaten hesabınız var mı?{' '}
              <MuiLink
                component={Link}
                to="/login"
                underline="hover"
                sx={{
                  color: '#3b82f6',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#6366f1',
                    transform: 'translateX(2px)',
                  },
                }}
              >
                Giriş Yap
              </MuiLink>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
