"use client";

import React from "react";
import apiClient from "@/services/auth/axiosInterceptor";

const checkSetupStatus = async (userId: number) => {
    return (await apiClient.get(`/setup_status/${userId}`)).data.setup_status;
};

export default function SandboxPage() {
  return (
    <div>
      <h1>サンドボックスページ</h1>
      <p>ここは開発用のサンドボックスページです</p>
    </div>
  );
}
