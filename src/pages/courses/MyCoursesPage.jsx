import { useState } from 'react';
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
import { enrollmentService } from '@/services/enrollmentService';
import { useToast } from '@/hooks/useToast';

const getAttendanceStatus = (percentage) => {
  if (percentage === undefined || percentage === null)
    return { label: 'N/A', color: 'default' };
  if (percentage >= 80) return { label: 'OK', color: 'success' };
  if (percentage >= 70) return { label: 'Warning', color: 'warning' };
  return { label: 'Critical', color: 'error' };
};

export const MyCoursesPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => enrollmentService.myCourses(),
  });

  const dropMutation = useMutation({
    mutationFn: (enrollmentId) => enrollmentService.drop(enrollmentId),
    onSuccess: (res) => {
      toast.success(res.message ?? 'Ders bırakıldı');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      setSelectedEnrollment(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'İşlem sırasında hata oluştu');
    },
  });

  const handleDropClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
  };

  const handleConfirmDrop = () => {
    if (!selectedEnrollment) return;
    dropMutation.mutate(selectedEnrollment.enrollmentId);
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
        <Typography mt={2}>Dersleriniz yükleniyor...</Typography>
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => refetch()}>Tekrar dene</Button>}
      >
        Derslerim listesi alınamadı.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Derslerim
      </Typography>

      {data.length === 0 ? (
        <Alert severity="info">Henüz kayıtlı dersiniz yok.</Alert>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kurs</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Eğitmen</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Yoklama</TableCell>
                <TableCell align="right">İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((enrollment) => {
                const status = getAttendanceStatus(enrollment.attendancePercentage);
                return (
                  <TableRow key={enrollment.enrollmentId}>
                    <TableCell>
                      <Typography fontWeight={600}>{enrollment.course.code}</Typography>
                      <Typography color="text.secondary">{enrollment.course.name}</Typography>
                    </TableCell>
                    <TableCell>{enrollment.section.sectionNumber}</TableCell>
                    <TableCell>{enrollment.section.instructor}</TableCell>
                    <TableCell>{enrollment.section.scheduleText}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          enrollment.attendancePercentage !== undefined
                            ? `${status.label} (${enrollment.attendancePercentage}%)`
                            : status.label
                        }
                        color={status.color === 'default' ? undefined : status.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={() => handleDropClick(enrollment)}
                      >
                        Dersten Ayrıl
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Dialog
            open={Boolean(selectedEnrollment)}
            onClose={() => setSelectedEnrollment(null)}
          >
            <DialogTitle>Dersden Ayrıl</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedEnrollment
                  ? `${selectedEnrollment.course.code} ${selectedEnrollment.course.name} dersinden ayrılmak üzeresiniz.`
                  : 'Ders seçilmedi.'}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEnrollment(null)}>İptal</Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDrop}
                disabled={dropMutation.isPending}
              >
                {dropMutation.isPending ? 'İşleniyor...' : 'Onayla'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

