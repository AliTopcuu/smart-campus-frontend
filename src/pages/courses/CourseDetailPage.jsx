import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleRounded';
import WarningIcon from '@mui/icons-material/WarningAmberRounded';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['course', id],
    queryFn: () => (id ? courseService.getById(id) : Promise.reject()),
    enabled: Boolean(id),
  });

  const enrollMutation = useMutation({
    mutationFn: (sectionId) => enrollmentService.enroll({ sectionId }),
    onSuccess: (res) => {
      toast.success(res.message ?? 'Derse kayıt başarıyla tamamlandı');
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      setSelectedSection(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Kayıt sırasında hata oluştu');
    },
  });

  const handleEnrollClick = (section) => {
    setSelectedSection(section);
  };

  const handleConfirmEnroll = () => {
    if (!selectedSection) return;
    enrollMutation.mutate(selectedSection.id);
  };

  const renderPrerequisites = (course) => {
    if (!course.prerequisites?.length) {
      return <Typography color="text.secondary">Ön koşul bulunmuyor.</Typography>;
    }
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
        {course.prerequisites.map((prereq) => (
          <Chip
            key={prereq.id}
            label={`${prereq.code} - ${prereq.name}`}
            size="small"
          />
        ))}
      </Stack>
    );
  };

  const renderSections = (course) => {
    if (!course.sections?.length) {
      return <Typography color="text.secondary">Bu ders için section bulunmuyor.</Typography>;
    }

    const isStudent = user?.role === 'student';

    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Section</TableCell>
            <TableCell>Eğitmen</TableCell>
            <TableCell>Program</TableCell>
            <TableCell align="center">Kapasite</TableCell>
            {isStudent && <TableCell align="right">İşlem</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {course.sections.map((section) => {
            const available = section.enrolledCount < section.capacity;
            return (
              <TableRow key={section.id}>
                <TableCell>{section.sectionNumber}</TableCell>
                <TableCell>{section.instructor}</TableCell>
                <TableCell>{section.scheduleText}</TableCell>
                <TableCell align="center">
                  {section.enrolledCount}/{section.capacity}{' '}
                  {available ? (
                    <CheckCircleIcon fontSize="small" color="success" />
                  ) : (
                    <WarningIcon fontSize="small" color="warning" />
                  )}
                </TableCell>
                {isStudent && (
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEnrollClick(section)}
                      disabled={!available}
                    >
                      {available ? 'Kaydol' : 'Dolu'}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
        <Typography mt={2}>Ders bilgileri yükleniyor...</Typography>
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => refetch()}>Tekrar dene</Button>}
      >
        Ders bilgisi alınamadı.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {data.code} - {data.name}
      </Typography>
      <Typography color="text.secondary" mb={3}>
        {data.department} • {data.credits} Kredi • {data.ects} ECTS
      </Typography>

      {data.description && (
        <Typography mb={4} color="text.secondary">
          {data.description}
        </Typography>
      )}

      <Box mb={4}>
        <Typography variant="h6">Ön Koşullar</Typography>
        {renderPrerequisites(data)}
      </Box>

      <Box>
        <Typography variant="h6" mb={2}>
          Sectionlar
        </Typography>
        {renderSections(data)}
      </Box>

      <Dialog open={Boolean(selectedSection)} onClose={() => setSelectedSection(null)}>
        <DialogTitle>Derste Kaydol</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedSection
              ? `${selectedSection.sectionNumber} numaralı section için kayıt olmak üzeresiniz. Onaylıyor musunuz?`
              : 'Section seçilmedi.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSection(null)}>İptal</Button>
          <Button
            variant="contained"
            onClick={handleConfirmEnroll}
            disabled={enrollMutation.isPending}
          >
            {enrollMutation.isPending ? 'Kaydediliyor...' : 'Onayla'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

