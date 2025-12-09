import { useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/FileDownloadRounded';
import ShowChartIcon from '@mui/icons-material/ShowChartRounded';
import { useToast } from '@/hooks/useToast';

const mockGrades = [
  {
    code: 'CENG101',
    name: 'Introduction to Computer Engineering',
    midterm: 80,
    final: 92,
    letter: 'A',
    gradePoint: 4.0,
  },
  {
    code: 'MATH105',
    name: 'Calculus I',
    midterm: 75,
    final: 83,
    letter: 'B',
    gradePoint: 3.0,
  },
  {
    code: 'PHYS101',
    name: 'Physics I',
    midterm: 68,
    final: 77,
    letter: 'B-',
    gradePoint: 2.7,
  },
];

export const GradesPage = () => {
  const toast = useToast();

  const summary = useMemo(() => {
    const totalPoints = mockGrades.reduce((sum, grade) => sum + grade.gradePoint, 0);
    const gpa = (totalPoints / mockGrades.length).toFixed(2);
    const cgpa = (parseFloat(gpa) * 0.8 + 0.2 * 3.45).toFixed(2); // örnek formül
    return { gpa, cgpa };
  }, []);

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              GPA
            </Typography>
            <Typography variant="h4">{summary.gpa}</Typography>
            <Typography color="text.secondary">Bu dönem ortalaması</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              CGPA
            </Typography>
            <Typography variant="h4">{summary.cgpa}</Typography>
            <Typography color="text.secondary">Genel ortalama</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ShowChartIcon color="primary" fontSize="large" />
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Trend
                </Typography>
                <Typography variant="h6" color="primary">
                  +0.12 ↑
                </Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" mb={2}>
            <Typography variant="h6">Ders Notları</Typography>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              onClick={() => toast.info('Transkript indiriliyor (mock)')}
            >
              Transkripti İndir (PDF)
            </Button>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Kod</TableCell>
                <TableCell>Ders</TableCell>
                <TableCell align="center">Vize</TableCell>
                <TableCell align="center">Final</TableCell>
                <TableCell align="center">Harf</TableCell>
                <TableCell align="center">Puan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockGrades.map((grade) => (
                <TableRow key={grade.code}>
                  <TableCell>{grade.code}</TableCell>
                  <TableCell>{grade.name}</TableCell>
                  <TableCell align="center">{grade.midterm}</TableCell>
                  <TableCell align="center">{grade.final}</TableCell>
                  <TableCell align="center">{grade.letter}</TableCell>
                  <TableCell align="center">{grade.gradePoint.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

