import apiClient from "@/services/auth/axiosInterceptor";

const checkSetupStatus = async (userId: number) => {
    return (await apiClient.get(`/setup_status/${userId}`)).data.setup_status;
};
