import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/SaveRounded';
import { useToast } from '@/hooks/useToast';

const mockStudents = [
  { id: 'stu-1', name: 'Ayşe Yılmaz', studentNumber: '20201234', midterm: 75, final: 0 },
  { id: 'stu-2', name: 'Mehmet Demir', studentNumber: '20203456', midterm: 82, final: 0 },
  { id: 'stu-3', name: 'Selin Kaya', studentNumber: '20205678', midterm: 90, final: 0 },
];

const mockSections = [
  { id: 'SEC-01', label: 'CENG204 - Section 01' },
  { id: 'SEC-02', label: 'CENG204 - Section 02' },
];

export const GradebookPage = () => {
  const { sectionId } = useParams();
  const toast = useToast();
  const [section, setSection] = useState(sectionId ?? mockSections[0].id);
  const [grades, setGrades] = useState(() => mockStudents);

  const handleGradeChange = (studentId, field, value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    setGrades((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, [field]: Math.max(0, Math.min(100, numeric)) }
          : student
      )
    );
  };

  const summary = useMemo(() => {
    const savedCount = grades.filter((student) => student.final > 0).length;
    return `${savedCount}/${grades.length} öğrenci notları girildi`;
  }, [grades]);

  const handleSave = () => {
    toast.success('Notlar mock olarak kaydedildi');
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" mb={3}>
        <Typography variant="h4" flex={1}>
          Not Defteri
        </Typography>
        <TextField
          select
          label="Section"
          value={section}
          onChange={(event) => setSection(event.target.value)}
          sx={{ minWidth: 240 }}
        >
          {mockSections.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1" color="text.secondary">
              {summary}
            </Typography>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Notları Kaydet
            </Button>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Öğrenci</TableCell>
                <TableCell>Numara</TableCell>
                <TableCell align="center">Vize</TableCell>
                <TableCell align="center">Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.studentNumber}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={student.midterm}
                      onChange={(event) =>
                        handleGradeChange(student.id, 'midterm', event.target.value)
                      }
                      inputProps={{ min: 0, max: 100 }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={student.final}
                      onChange={(event) =>
                        handleGradeChange(student.id, 'final', event.target.value)
                      }
                      inputProps={{ min: 0, max: 100 }}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

