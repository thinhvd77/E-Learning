export interface User {
  id: number;
  username: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  videos?: Video[];
  quizzes?: Quiz[];
}

export interface Video {
  id: number;
  filename: string;
  title: string;
  courseId: number;
  course?: Course;
  createdAt: string;
}

export interface Quiz {
  id: number;
  title: string;
  courseId: number;
  course?: Course;
  questions?: Question[];
  createdAt: string;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer?: number; // Only for admin/results
  quizId: number;
}

export interface UserVideoProgress {
  id: number;
  userId: number;
  videoId: number;
  watchedSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}

export interface QuizSubmission {
  quizId: number;
  answers: { questionId: number; selectedOption: number }[];
}

export interface QuizResult {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  submittedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}