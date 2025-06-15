import { fetchAPI } from '@/services/auth/axiosInterceptor';

export interface WithdrawalPayload {
  amount: number;
  point_source: "regular" | "bonus";
  account_snapshot?: Record<string, any>;
}

export const createWithdrawal = (payload: WithdrawalPayload) =>
  fetchAPI('/api/v1/withdrawal/request', payload);

export const getMyWithdrawals = (params = { skip: 0, limit: 20 }) =>
  fetchAPI('/api/v1/withdrawal/me', params, 'GET');
