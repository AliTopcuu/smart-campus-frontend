import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { courseService } from '@/services/courseService';

const departmentOptions = [
  { value: '', label: 'Tümü' },
  { value: 'computer-engineering', label: 'Bilgisayar Müh.' },
  { value: 'electrical-engineering', label: 'Elektrik-Elektronik' },
  { value: 'industrial-engineering', label: 'Endüstri' },
  { value: 'business', label: 'İşletme' },
  { value: 'economics', label: 'İktisat' },
];

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const departmentQuery = searchParams.get('department') ?? '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localDepartment, setLocalDepartment] = useState(departmentQuery);

  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      department: departmentQuery || undefined,
    }),
    [searchQuery, departmentQuery]
  );

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['courses', queryParams],
    queryFn: () => courseService.list(queryParams),
    keepPreviousData: true,
  });

  const handleFilterSubmit = () => {
    const nextParams = new URLSearchParams();
    if (localSearch.trim()) nextParams.set('search', localSearch.trim());
    if (localDepartment) nextParams.set('department', localDepartment);
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setLocalDepartment('');
    setSearchParams({});
  };

  const handleSearchInput = (event) => {
    setLocalSearch(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setLocalDepartment(event.target.value);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Stack alignItems="center" py={6}>
          <CircularProgress />
          <Typography mt={2}>Dersler yükleniyor...</Typography>
        </Stack>
      );
    }

    if (isError || !data) {
      return (
        <Alert
          severity="error"
          action={<Button onClick={() => refetch()}>Tekrar dene</Button>}
        >
          Dersler alınırken bir hata oluştu. Lütfen tekrar deneyin.
        </Alert>
      );
    }

    if (data.length === 0) {
      return <Alert severity="info">Filtrelere uygun ders bulunamadı.</Alert>;
    }

    return (
      <Grid container spacing={2}>
        {data.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="subtitle2" color="text.secondary">
                    {course.code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {course.department}
                  </Typography>
                </Stack>
                <Typography variant="h6" mt={1}>
                  {course.name}
                </Typography>
                <Typography color="text.secondary" mt={1}>
                  {course.credits} Kredi • {course.ects} ECTS
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  component={Link}
                  to={`/courses/${course.id}`}
                  variant="outlined"
                  size="small"
                >
                  Detay
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Ders Kataloğu
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Ders adı veya kodu"
              value={localSearch}
              onChange={handleSearchInput}
              fullWidth
            />
            <TextField
              select
              label="Bölüm"
              value={localDepartment}
              onChange={handleDepartmentChange}
              fullWidth
            >
              {departmentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleFilterSubmit}
                disabled={isFetching}
              >
                Filtrele
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleResetFilters}
              >
                Sıfırla
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {renderContent()}
    </Box>
  );
};

