export type Student = {
  id: number;
  studentId: string;
  name: string;
  course: string;
  yearLevel: string;
  email: string;
  phone: string;
  active: boolean;
  qrValue: string;
};

export type StudentFormData = Omit<Student, "id">;