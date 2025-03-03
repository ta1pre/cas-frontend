// src/app/p/customer/search/components/search_options/filters/DropdownFilter.tsx

import React, { useEffect, useState } from "react";

interface DropdownFilterProps {
    filterKey: string;
    value: string | undefined;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
}

export default function DropdownFilter({ filterKey, value, onChange, options }: DropdownFilterProps) {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(value);

    // ✅ `value` の変更を監視し、 UI に即時反映
    useEffect(() => {
        if (value !== selectedValue) {
            setSelectedValue(value ?? ""); // ✅ `undefined` の場合は `""` にリセット
        }
    }, [value]);

    return (
        <select
            id={filterKey}
            value={selectedValue ?? ""}
            onChange={(e) => {
                const newValue = e.target.value;
                if (!newValue) return; // ✅ 無効な値は適用しない
                setSelectedValue(newValue);
                onChange(newValue);
            }}
        >
            <option value="">選択してください</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
