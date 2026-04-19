export interface Student {
  id: string;
  name: string;
  grade: string;
  points: number;
  streak: number;
}

export interface Progress {
  attendance: number;
  homework: number;
  streak: number;
}

export interface Habit {
  id: string;
  label: string;
  completed: boolean;
}

export interface HomeworkRecord {
  studentId: string;
  timestamp: string;
  audioUrl: string;
  shloka: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  present: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
