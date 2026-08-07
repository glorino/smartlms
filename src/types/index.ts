export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  bio: string | null;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  price: number;
  salePrice: number | null;
  currency: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  level: string;
  language: string;
  duration: number | null;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  tags: string[];
  category: string | null;
  isFeatured: boolean;
  instructor: User;
  sections?: CourseSection[];
  _count?: {
    enrollments: number;
    reviews: number;
  };
}

export interface CourseSection {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  type: string;
  videoUrl: string | null;
  audioUrl: string | null;
  pdfUrl: string | null;
  duration: number | null;
  order: number;
  isPreview: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  type: string;
  timeLimit: number | null;
  passingScore: number;
  maxAttempts: number | null;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  isPublished: boolean;
  difficulty: string;
  points: number;
  questions: Question[];
}

export interface Question {
  id: string;
  content: string;
  type: string;
  points: number;
  explanation: string | null;
  hint: string | null;
  imageUrl: string | null;
  order: number;
  difficulty: string;
  answers: Answer[];
  correctOrder: string[];
  rangeMin: number | null;
  rangeMax: number | null;
  rangeCorrect: number | null;
}

export interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  points: number;
  imageUrl: string | null;
  order: number;
}

export interface QuizAttempt {
  id: string;
  score: number;
  totalPoints: number;
  passed: boolean;
  answers: Record<string, string>;
  timeTaken: number | null;
  attemptNumber: number;
  startedAt: string;
  completedAt: string | null;
}

export interface Enrollment {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  course: Course;
}

export interface Certificate {
  id: string;
  title: string;
  certificateId: string;
  status: "ACTIVE" | "REVOKED";
  issuedAt: string;
  expiresAt: string | null;
  course: Course;
  user: User;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: User;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  platform: string;
  meetingUrl: string | null;
  scheduledAt: string;
  duration: number;
  recordingUrl: string | null;
  instructor: User;
}

export interface Purchase {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
  course?: Course;
}

export interface AnalyticsData {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  completionRate: number;
  enrollments: { date: string; count: number }[];
  revenue: { date: string; amount: number }[];
  topCourses: Course[];
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  createdAt: string;
  user: User;
}

export interface AIGeneratedContent {
  type: string;
  prompt: string;
  content: any;
  model: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
}
