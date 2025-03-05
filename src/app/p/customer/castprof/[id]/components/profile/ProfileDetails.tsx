// src/app/p/customer/castprof/[id]/components/ProfileDetails.tsx
import React from "react";
import { Box } from "@mui/material";
import { Trait, ServiceType } from "../../api/castprofTypes";

// ✅ カテゴリーごとにグループ化する関数
const groupByCategory = (items: { category: string; name: string }[]) => {
    const grouped: { [category: string]: string[] } = {};

    items.forEach(({ category, name }) => {
        if (!grouped[category]) {
            grouped[category] = [];
        }
        if (!grouped[category].includes(name)) {
            grouped[category].push(name); // ✅ 重複しないように追加
        }
    });

    return grouped;
};

interface ProfileDetailsProps {
    traits?: Trait[];
    serviceTypes?: ServiceType[];
}

export default function ProfileDetails({ traits = [], serviceTypes = [] }: ProfileDetailsProps) {
    const groupedTraits = groupByCategory(traits);
    let groupedServiceTypes = groupByCategory(serviceTypes);

    // ✅ 通常を先に表示し、高収入を最後に表示
    const sortedCategories = Object.entries(groupedServiceTypes).sort(([a], [b]) =>
        a === "高収入" ? 1 : b === "高収入" ? -1 : 0
    );

    return (
        <Box className="">
            {/* ✅ Traits（特徴） */}
            {Object.keys(groupedTraits).length > 0 && (
                <Box className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(groupedTraits).map(([category, names]) =>
                        names.map((name) => (
                            <Box key={`${category}-${name}`} className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                                {name}
                            </Box>
                        ))
                    )}
                </Box>
            )}

            {/* ✅ Service Types（サービス種別） */}
            {sortedCategories.length > 0 && (
                <Box className="mt-4 flex flex-wrap gap-2">
                    {sortedCategories.map(([category, names]) =>
                        names.map((name) => (
                            <Box
                                key={`${category}-${name}`}
                                className={`px-3 py-1 text-sm rounded-full ${
                                    category === "高収入" ? "bg-pink-100" : "bg-blue-100"
                                }`}
                            >
                                {name}
                            </Box>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
}
