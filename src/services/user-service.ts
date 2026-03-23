import { api } from './client';
import { endpoints } from './endpoints';

export const userService = {
  fetchMe: () =>
    api.get(endpoints.userMe),

  fetchMeStats: () =>
    api.get(endpoints.meStats),

  fetchProfile: (id: string | number) =>
    api.get(endpoints.userProfile(id)),

  fetchStats: (id: string | number) =>
    api.get(endpoints.userStats(id)),

  fetchHistory: () =>
    api.get(endpoints.userHistory),

  changePassword: (data: any) =>
    api.patch(endpoints.changePassword, data),

  // Notifications
  fetchNotifications: () =>
    api.get(endpoints.notifications),

  fetchUnreadCount: () =>
    api.get(endpoints.notificationsUnread),

  markAsRead: (id: string | number) =>
    api.patch(endpoints.notificationRead(id)),

  markAllAsRead: () =>
    api.patch(endpoints.notificationsReadAll),

  clearNotifications: () =>
    api.delete(endpoints.notificationsClear),

  // Friends
  fetchFriendList: (userId: string | number) =>
    api.get(endpoints.friendList(userId)),

  fetchPendingRequests: () =>
    api.get(endpoints.friendPending),

  sendFriendRequest: (targetUserId: string | number) =>
    api.post(endpoints.friendRequest, { targetUserId }),

  respondToRequest: (id: string | number, status: 'ACCEPTED' | 'REJECTED') =>
    api.patch(endpoints.friendRespond(id), { status }),

  cancelRequest: (id: string | number) =>
    api.delete(endpoints.friendCancel(id)),

  removeFriend: (friendId: string | number) =>
    api.delete(endpoints.friendRemove, { data: { friendId } }),

  checkFriendStatus: (userId: string | number) =>
    api.get(endpoints.friendStatus(userId)),

  // Reports
  submitReport: (data: any) =>
    api.post(endpoints.submitReport, data),

  fetchMyReports: () =>
    api.get(endpoints.myReports),

  fetchReportDetail: (id: string | number) =>
    api.get(endpoints.reportDetail(id)),
};

export default userService;
