// src/app/p/customer/castprof/[id]/components/profile/HighIncomeDetails.tsx
import React from "react";
import { Box } from "@mui/material";
import { ServiceType } from "../../api/castprofTypes";

interface HighIncomeDetailsProps {
    serviceTypes?: ServiceType[];
}

export default function HighIncomeDetails({ serviceTypes = [] }: HighIncomeDetailsProps) {
    // ✅ 高収入カテゴリーのサービス種別のみを抽出
    const highIncomeServiceTypes = serviceTypes.filter(
        (serviceType) => serviceType.category === "高収入"
    );

    return (
        <Box className="mt-4 flex flex-wrap gap-2">
            {highIncomeServiceTypes.map((serviceType) => (
                <Box
                    key={`${serviceType.category}-${serviceType.name}`}
                    className="px-3 py-1 text-sm rounded-full bg-pink-100"
                >
                    {serviceType.name}
                </Box>
            ))}
        </Box>
    );
}
