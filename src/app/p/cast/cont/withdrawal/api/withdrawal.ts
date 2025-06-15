import { fetchAPI } from '@/services/auth/axiosInterceptor';

export interface WithdrawalPayload {
  regular_amount: number;
  bonus_amount: number;
  account_snapshot?: Record<string, any>;
}

export interface PointBalance {
  regular_points: number;
  bonus_points: number;
  total_points: number;
}

export const createWithdrawal = (payload: WithdrawalPayload) =>
  fetchAPI('/api/v1/withdrawal/request', payload);

export const getMyWithdrawals = (params = { skip: 0, limit: 20 }) =>
  fetchAPI('/api/v1/withdrawal/me', params, 'GET');

export const getPointBalance = (): Promise<PointBalance> =>
  fetchAPI('/api/v1/withdrawal/balance', {}, 'GET');
