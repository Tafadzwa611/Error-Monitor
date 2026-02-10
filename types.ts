
export enum ErrorType {
  CELERY = "Celery Task Failure",
  LOAN = "Loan Balances Check",
  INSTALLMENTS = "Installments Check",
  SYSTEM = "System Error"
}

export interface ErrorLog {
  id: string;
  emailId: string;
  subject: string;
  body: string;
  errorType: ErrorType;
  taskId: string | null;
  taskName: string | null;
  logFile: string | null;
  entity: string | null;
  receivedDate: any; // Firestore Timestamp or Date
  createdAt: any;
  statusCode?: number | null;
  path?: string | null;
}

export interface AnalyticsData {
  totalErrors: number;
  errorsByType: Array<{ type: string; count: number }>;
  errorsByDay: Array<{ date: string; count: number }>;
  topFailingTasks: Array<{ taskName: string; count: number; lastOccurred: string }>;
  recentErrors: ErrorLog[];
  errorRate: {
    today: number;
    yesterday: number;
    lastWeek: number;
    thisWeek: number;
  };
}

export interface FetchErrorsParams {
  page?: number;
  limit?: number;
  errorType?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
