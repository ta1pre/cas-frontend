import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function loginTenant(email: string, password: string) {
  const response = await axios.post(
    `${apiUrl}/api/v1/tenants/auth/login`,
    { email, password }
  );
  return response.data;
}
