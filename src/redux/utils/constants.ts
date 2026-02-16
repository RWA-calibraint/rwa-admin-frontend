const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

const END_POINTS = {
  signup: '/admin/auth/signup',
  signin: '/admin/auth/signin',
  confirmSignup: '/admin/auth/confirm-signup',
  forgetPassword: '/admin/auth/forgot-password',
  resetPassword: '/admin/auth/confirm-forgot-password',
  verifyOtp: '/admin/auth/verify-otp',
  getAssetCategories: '/admin/dashboard/asset/category',
  getAssetCountMetrics: '/admin/dashboard/asset/count/metrics',
  getCategoryList: '/admin/assets/category/list',
  verifyAsset: '/admin/assets/verify',
  approveAsset: (assetId: string) => `/admin/assets/approve/?assetId=${assetId}`,
  verifyDocument: '/admin/assets/document/verify',
  updateTokens: '/admin/assets/token/update',
  uploadDocuments: '/admin/assets/create-documents',
  mintTokens: '/admin/assets/mint-tokens',
  burnTokens: '/admin/assets/burn-tokens',
  getTxsList: (page: number, size: number, search: string) =>
    `/admin/payments?page=${page}&size=${size}&search=${search}`,
  updatePaymentAsRefunded: (userId: string) => `/admin/payments/update-user/${userId}/refund`,

  getPendingAssets: (
    search: string,
    category: string,
    status: string,
    page: number,
    size: number,
    startDate: string,
    endDate: string,
  ) =>
    `/admin/assets/pending?search=${search}&category=${category}&status=${status}&page=${page}&limit=${size}&startDate=${startDate}&endDate=${endDate}`,
  getApprovedAssets: (
    search: string,
    category: string,
    status: string,
    page: number,
    size: number,
    startDate: string,
    endDate: string,
  ) =>
    `/admin/assets/approved?search=${search}&category=${category}&status=${status}&page=${page}&limit=${size}&startDate=${startDate}&endDate=${endDate}`,
  getRejectedAssets: (
    search: string,
    category: string,
    status: string,
    page: number,
    size: number,
    startDate: string,
    endDate: string,
  ) =>
    `/admin/assets/rejected?search=${search}&category=${category}&status=${status}&page=${page}&limit=${size}&startDate=${startDate}&endDate=${endDate}`,
  updateUserAsBlockedOrActive: (userId: string) => `/admin/users/update-user-status/${userId}`,
  updateUserAsSuspend: (userId: string) => `/admin/users/update-user/${userId}/suspend`,
  getAssetSoldMetrics: (category: string, year: string) =>
    `/admin/dashboard/asset/sold/metrics?category=${category}&year=${year}`,
  getUserMetrics: () => '/admin/dashboard/user/status/metrics',
  getUserCountMetrics: (year: string) => `/admin/dashboard/user/count/metrics?year=${year}`,
  getTokenCountMetrics: (year: number, month: number = 0, week: number = 0) =>
    `/admin/dashboard/tokens/metrics?year=${year}&month=${month}&week=${week}`,
  getUserList: (page: number, size: number, search: string) =>
    `/admin/users?page=${page}&size=${size}&search=${search}`,
  getAssetDetail: (assetId: string) => `/admin/assets/${assetId}/find`,
  deleteAsset: (assetId: string) => `/admin/assets/${assetId}`,
  editAsset: (assetId: string) => `/admin/assets/${assetId}/update`,
  createAsset: '/admin/assets/create',
  checkFeatured: '/admin/assets/featured/asset/availability',
  analyseImage: '/admin/assets/analyze',
  getNotifications: '/admin/notifications',
  readSingleNotification: (id: string) => `/admin/notifications/read/${id}`,
  readAllNotifications: '/admin/notifications/read-all',
  getAdminProfile: '/admin/profile/',
  updateAdminProfile: '/admin/updateProfile',
  getAllAdmins: (page: string, size: string, searchValue: string) =>
    `/admin/getAdmins?page=${page}&size=${size}&search=${searchValue}`,
  deleteAdmin: (id: string) => `/admin/${id}`,
  getUser: (id: string) => `/admin/users/${id}`,
  sendUserFeedback: `/admin/users/feedback`,
  updateAssetPrice: (assetId: string) => `/admin/assets/updateAssetPrice/${assetId}`,
};

const API = {
  AUTH_API: 'authApi',
  DASHBOARD_API: 'dashboardApi',
  USER_MANAGEMENT_API: 'userManagementApi',
  ASSET_API: 'assetApi',
};

export { API, API_METHODS, END_POINTS };
