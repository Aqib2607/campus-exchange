import axios from 'axios';
import type {
  Category,
  Conversation,
  DashboardStatistics,
  Message,
  Product,
  PurchaseRequest,
  Report,
  User,
} from "@/types";

const apiClient = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extract data from the Laravel standardized response format: { success: true, data: [...] }
const extractData = (response: any) => response.data.data;

export const api = {
  auth: {
    register: (data: any) => apiClient.post('/auth/register', data).then(res => res.data),
    login: (data: any) => apiClient.post('/auth/login', data).then(res => res.data),
    logout: () => apiClient.post('/auth/logout').then(res => res.data),
    me: () => apiClient.get('/auth/user').then(extractData),
    updateProfile: (data: any) => apiClient.put('/auth/user', data).then(res => res.data),
    resendVerification: () => apiClient.post('/email/verification-notification').then(res => res.data),
    forgotPassword: (data: any) => apiClient.post('/auth/forgot-password', data).then(res => res.data),
    resetPassword: (data: any) => apiClient.post('/auth/reset-password', data).then(res => res.data),
  },
  products: {
    list: (params?: any) => apiClient.get<any>('/products', { params }).then(extractData),
    mine: () => apiClient.get<any>('/products/mine').then(extractData),
    get: (id: number) => apiClient.get<any>(`/products/${id}`).then(extractData),
    byUser: (userId: number) => apiClient.get<any>('/products', { params: { user_id: userId } }).then(extractData),
    create: (data: FormData | any) => {
      const isFormData = data instanceof FormData;
      return apiClient.post('/products', data, 
        isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
      ).then(extractData);
    },
    update: (id: number, data: FormData | any) => {
      const isFormData = data instanceof FormData;
      // Laravel doesn't support file upload via PATCH, so we use POST with _method spoofing
      if (isFormData) {
        data.append('_method', 'PATCH');
        return apiClient.post(`/products/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(extractData);
      }
      return apiClient.patch(`/products/${id}`, data).then(extractData);
    },
    delete: (id: number) => apiClient.delete(`/products/${id}`).then(res => res.data),
  },
  categories: {
    list: () => apiClient.get<any>('/categories').then(extractData),
    create: (data: any) => apiClient.post('/admin/categories', data).then(extractData),
    update: (id: number, data: any) => apiClient.put(`/admin/categories/${id}`, data).then(extractData),
    delete: (id: number) => apiClient.delete(`/admin/categories/${id}`).then(res => res.data),
  },
  users: {
    list: () => apiClient.get<any>('/admin/users').then(extractData),
    block: (id: number) => apiClient.patch(`/admin/users/${id}/block`).then(res => res.data),
    delete: (id: number) => apiClient.delete(`/admin/users/${id}`).then(res => res.data),
  },
  favorites: {
    list: () => apiClient.get<any>('/favorites').then(extractData),
    add: (productId: number) => apiClient.post(`/products/${productId}/favorite`).then(extractData),
    remove: (productId: number) => apiClient.delete(`/products/${productId}/favorite`).then(res => res.data),
  },
  requests: {
    sent: () => apiClient.get<any>('/requests/sent').then(extractData),
    received: () => apiClient.get<any>('/requests/received').then(extractData),
    create: (productId: number, data?: any) => apiClient.post(`/products/${productId}/requests`, data).then(extractData),
    accept: (id: number) => apiClient.patch(`/requests/${id}/accept`).then(extractData),
    reject: (id: number) => apiClient.patch(`/requests/${id}/reject`).then(extractData),
  },
  conversations: {
    list: () => apiClient.get<any>('/conversations').then(extractData),
    get: (id: number) => apiClient.get<any>(`/conversations/${id}`).then(extractData),
    create: (data: any) => apiClient.post('/conversations', data).then(extractData),
    messages: (conversationId: number) => apiClient.get<any>(`/conversations/${conversationId}/messages`).then(extractData),
    sendMessage: (conversationId: number, data: any) => apiClient.post(`/conversations/${conversationId}/messages`, data).then(extractData),
  },
  reports: {
    mine: () => apiClient.get<any>('/reports/mine').then(extractData),
    create: (data: any) => apiClient.post('/reports', data).then(extractData),
    list: () => apiClient.get<any>('/admin/reports').then(extractData),
    resolve: (id: number) => apiClient.patch(`/admin/reports/${id}/resolve`).then(res => res.data),
  },
  admin: {
    statistics: () => apiClient.get<any>('/admin/statistics').then(extractData),
    products: () => apiClient.get<any>('/admin/products').then(extractData),
    deleteProduct: (id: number) => apiClient.delete(`/admin/products/${id}`).then(res => res.data),
  },
};
