export type Class = {
  id: number;
  classCode: string;
  subject: string;
  instructor: string;
  schedule: string;
  room: string;
  active: boolean;
};

export type ClassFormData = Omit<Class, "id">;