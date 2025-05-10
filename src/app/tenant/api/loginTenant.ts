import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function loginTenant(email: string, password: string) {
  const response = await axios.post(
    `${apiUrl}/api/v1/tenants/auth/login`,
    { email, password }
  );
  console.log('✅ 【loginTenant】APIレスポンス:', {
    status: response.status,
    data: {
      token: response.data?.token ? response.data.token.substring(0, 5) + '...' : 'なし',
      refresh_token: response.data?.refresh_token ? response.data.refresh_token.substring(0, 5) + '...' : 'なし'
    }
  });
  return response.data;
}
