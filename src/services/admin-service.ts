import { adminApi } from './client';
import { endpoints } from './endpoints';

export const adminService = {
  // Auth
  login: (username: string, password: string) =>
    adminApi.post(endpoints.adminLogin, { username, password }),

  // Reports
  fetchReports: (params?: Record<string, any>) =>
    adminApi.get(endpoints.adminReports, { params }),

  fetchReportStats: () =>
    adminApi.get(endpoints.adminReportStats),

  reviewReport: (
    id: string | number,
    data: {
      status: string;
      moderatorNote?: string;
      violationTags?: string[];
      violationScore?: number;
    }
  ) => adminApi.patch(endpoints.adminReviewReport(id), data),

  // Audit Logs
  fetchAuditLogs: (params?: Record<string, any>) =>
    adminApi.get(endpoints.adminAuditLogs, { params }),

  // Users
  unbanUser: (userId: string | number) =>
    adminApi.patch(endpoints.adminUnbanUser(userId)),

  fetchUser: (userId: string | number) =>
    adminApi.get(endpoints.adminUserDetail(userId)),

  fetchPlatformStats: () =>
    adminApi.get(endpoints.adminPlatformStats),

  fetchHeatmap: () =>
    adminApi.get(endpoints.adminHeatmap),

  fetchUsers: (params?: Record<string, any>) =>
    adminApi.get(endpoints.adminUsers, { params }),

  updateUserStatus: (id: string | number, data: any) =>
    adminApi.patch(endpoints.adminUpdateUser(id), data),

  fetchPins: (params?: Record<string, any>) =>
    adminApi.get(endpoints.adminPins, { params }),

  deletePin: (id: string | number) =>
    adminApi.delete(endpoints.adminDeletePin(id)),
};

export default adminService;
