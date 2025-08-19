import axios, { AxiosInstance } from 'axios';
import { Course, Video, Quiz, QuizSubmission, QuizResult, AuthResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/api/auth/login', { username, password });
    return response.data;
  }

  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/api/auth/register', { username, password });
    return response.data;
  }

  // Course endpoints
  async getCourses(): Promise<Course[]> {
    const response = await this.api.get('/api/courses');
    return response.data;
  }

  async getCourse(id: number): Promise<Course> {
    const response = await this.api.get(`/api/courses/${id}`);
    return response.data;
  }

  async createCourse(title: string, description?: string): Promise<Course> {
    const response = await this.api.post('/api/courses', { title, description });
    return response.data;
  }

  async updateCourse(id: number, title: string, description?: string): Promise<Course> {
    const response = await this.api.put(`/api/courses/${id}`, { title, description });
    return response.data;
  }

  async deleteCourse(id: number): Promise<void> {
    await this.api.delete(`/api/courses/${id}`);
  }

  // Video endpoints
  async uploadVideo(courseId: number, file: File, title: string): Promise<Video> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    const response = await this.api.post(`/api/videos/upload/course/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getVideosByCourse(courseId: number): Promise<Video[]> {
    const response = await this.api.get(`/api/videos/course/${courseId}`);
    return response.data;
  }

  getVideoStreamUrl(videoId: number): string {
    const token = localStorage.getItem('token');
    return `${this.api.defaults.baseURL}/api/videos/stream/${videoId}?token=${token}`;
  }

  // Quiz endpoints
  async uploadQuiz(courseId: number, file: File): Promise<Quiz> {
    const formData = new FormData();
    formData.append('excel', file);

    const response = await this.api.post(`/api/quizzes/upload/course/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getQuiz(quizId: number): Promise<Quiz> {
    const response = await this.api.get(`/api/quizzes/${quizId}`);
    return response.data;
  }

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const response = await this.api.post(`/api/quizzes/${submission.quizId}/submit`, {
      answers: submission.answers,
    });
    return response.data;
  }

  // Progress endpoints
  async updateVideoProgress(videoId: number, watchedSeconds: number, completed: boolean): Promise<void> {
    await this.api.post('/api/progress/video', {
      videoId,
      watchedSeconds,
      completed,
    });
  }

  async getUserProgress(userId?: number): Promise<any> {
    const url = userId ? `/api/progress/user/${userId}` : '/api/progress/user';
    const response = await this.api.get(url);
    return response.data;
  }

  // Admin reports
  async getCourseReport(courseId: number): Promise<any> {
    const response = await this.api.get(`/api/quizzes/reports/course/${courseId}`);
    return response.data;
  }

  async getQuizReport(quizId: number): Promise<any> {
    const response = await this.api.get(`/api/quizzes/reports/quiz/${quizId}`);
    return response.data;
  }
}

export const apiService = new ApiService();