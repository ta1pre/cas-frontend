/**
 * Admin Cast 身分証画像 API
 */
import { fetchAPI } from '@/services/auth/axiosInterceptor';

export interface IdentityDoc {
  id: number;
  url: string;
  created_at: string;
  status?: string | null;
}

export const getIdentityDocs = async (castId: number) => {
  return await fetchAPI(`/api/v1/admin/cast/${castId}/identity-documents`, undefined, 'GET') as IdentityDoc[] | null;
};
