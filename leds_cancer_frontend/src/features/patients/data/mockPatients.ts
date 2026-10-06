import type { Patient } from '@/types/patient';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P-001', name: 'Maria Silva Santos', birthDate: '14/03/1972', age: 54,
    cpf: '123.456.789-00', phone: '(11) 99871-2345', email: 'maria.santos@email.com',
    status: 'ativo', lastExam: '15/06/2026', totalExams: 5,
    exams: [
      { id: 'EX-001', date: '15/06/2026', type: 'Mamografia Digital', status: 'concluido', radiologist: 'Dr. Carlos Mendes' },
      { id: 'EX-008', date: '10/01/2026', type: 'Mamografia 3D',      status: 'concluido', radiologist: 'Dra. Ana Figueiredo' },
      { id: 'EX-015', date: '05/06/2025', type: 'Mamografia Digital', status: 'concluido', radiologist: 'Dr. Carlos Mendes' },
    ],
  },
  {
    id: 'P-002', name: 'Ana Paula Ferreira', birthDate: '22/07/1985', age: 40,
    cpf: '234.567.890-11', phone: '(11) 98762-3456', email: 'ana.ferreira@email.com',
    status: 'ativo', lastExam: '15/06/2026', totalExams: 3,
    exams: [
      { id: 'EX-002', date: '15/06/2026', type: 'Mamografia 3D',      status: 'em_analise',  radiologist: 'Dr. Carlos Mendes' },
      { id: 'EX-009', date: '20/12/2025', type: 'Mamografia Digital', status: 'concluido', radiologist: 'Dra. Ana Figueiredo' },
    ],
  },
  {
    id: 'P-003', name: 'Carla Mendes Rocha', birthDate: '08/11/1968', age: 57,
    cpf: '345.678.901-22', phone: '(21) 97653-4567', email: 'carla.rocha@email.com',
    status: 'ativo', lastExam: '15/06/2026', totalExams: 8,
    exams: [
      { id: 'EX-003', date: '15/06/2026', type: 'Mamografia Digital', status: 'pendente',  radiologist: 'Dr. Carlos Mendes' },
      { id: 'EX-010', date: '15/11/2025', type: 'Mamografia 3D',      status: 'concluido', radiologist: 'Dr. Carlos Mendes' },
    ],
  },
  {
    id: 'P-004', name: 'Fernanda Costa Lima', birthDate: '30/04/1979', age: 47,
    cpf: '456.789.012-33', phone: '(31) 96544-5678', email: 'fernanda.lima@email.com',
    status: 'ativo', lastExam: '15/06/2026', totalExams: 2,
    exams: [
      { id: 'EX-004', date: '15/06/2026', type: 'Mamografia 3D',      status: 'concluido', radiologist: 'Dra. Ana Figueiredo' },
    ],
  },
  {
    id: 'P-005', name: 'Juliana Alves Nunes', birthDate: '17/09/1990', age: 35,
    cpf: '567.890.123-44', phone: '(41) 95435-6789', email: 'juliana.nunes@email.com',
    status: 'ativo', lastExam: '15/06/2026', totalExams: 1,
    exams: [
      { id: 'EX-005', date: '15/06/2026', type: 'Mamografia Digital', status: 'pendente', radiologist: 'Dr. Carlos Mendes' },
    ],
  },
  {
    id: 'P-006', name: 'Patricia Gomes Dias', birthDate: '03/02/1963', age: 63,
    cpf: '678.901.234-55', phone: '(51) 94326-7890', email: 'patricia.dias@email.com',
    status: 'inativo', lastExam: '15/06/2026', totalExams: 11,
    exams: [
      { id: 'EX-006', date: '15/06/2026', type: 'Mamografia 3D',      status: 'cancelado', radiologist: 'Dr. Carlos Mendes' },
      { id: 'EX-011', date: '02/12/2025', type: 'Mamografia Digital', status: 'concluido', radiologist: 'Dra. Ana Figueiredo' },
    ],
  },
  {
    id: 'P-007', name: 'Rosana Teixeira Barros', birthDate: '25/06/1975', age: 50,
    cpf: '789.012.345-66', phone: '(85) 93217-8901', email: 'rosana.barros@email.com',
    status: 'ativo', lastExam: '10/05/2026', totalExams: 6,
    exams: [
      { id: 'EX-012', date: '10/05/2026', type: 'Mamografia 3D',      status: 'concluido', radiologist: 'Dr. Carlos Mendes' },
    ],
  },
  {
    id: 'P-008', name: 'Luciana Pereira Souza', birthDate: '12/12/1982', age: 43,
    cpf: '890.123.456-77', phone: '(62) 92108-9012', email: 'luciana.souza@email.com',
    status: 'ativo', lastExam: '02/04/2026', totalExams: 4,
    exams: [
      { id: 'EX-013', date: '02/04/2026', type: 'Mamografia Digital', status: 'concluido', radiologist: 'Dra. Ana Figueiredo' },
    ],
  },
  {
    id: 'P-009', name: 'Beatriz Oliveira Castro', birthDate: '19/08/1958', age: 67,
    cpf: '901.234.567-88', phone: '(71) 91099-0123', email: 'beatriz.castro@email.com',
    status: 'inativo', lastExam: '14/01/2026', totalExams: 15,
    exams: [
      { id: 'EX-014', date: '14/01/2026', type: 'Mamografia 3D',      status: 'concluido', radiologist: 'Dr. Carlos Mendes' },
    ],
  },
  {
    id: 'P-010', name: 'Simone Rodrigues Pinto', birthDate: '07/05/1995', age: 31,
    cpf: '012.345.678-99', phone: '(48) 90990-1234', email: 'simone.pinto@email.com',
    status: 'ativo', lastExam: null, totalExams: 0,
    exams: [],
  },
];
