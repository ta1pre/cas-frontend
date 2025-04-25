// テナント作成API呼び出し
import { fetchAPI } from '@/services/auth/axiosInterceptor';

export type CreateTenantParams = {
  email: string;
  password: string;
  nick_name: string;
};

export type CreateTenantResponse = {
  user_id: number;
  email: string;
  status: string;
};

export async function createTenant(params: CreateTenantParams): Promise<CreateTenantResponse> {
  // ✅ fetchAPIの戻り値にresponse.dataを渡すのではなく、response自体を渡すように変更
  const response = await fetchAPI('/api/v1/admin/tenant/tenant/create/', params);
  console.log('✅ createTenantレスポンス:', response);
  return response;
}
