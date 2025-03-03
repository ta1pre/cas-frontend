import React, { useState } from "react";
import { Slider, Typography, Box } from "@mui/material";

interface RangeFilterProps {
    filterKey: string;
    value?: [number, number];
    min: number;
    max: number;
    step?: number;
    unit?: string; // ✅ 単位プロパティを追加
    onChange: (value: [number, number]) => void;
}

export default function RangeFilter({ value, min, max, step = 1, unit = "", onChange }: RangeFilterProps) {
    const [range, setRange] = useState<[number, number]>(value || [min, max]);

    const handleChange = (_: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setRange(newValue as [number, number]);
        }
    };

    const handleApply = () => {
        onChange(range);
    };

    return (
        <Box className="relative w-full p-4">
            {/* ✅ 数字＋単位をスライダーの上に表示 */}
            <Typography className="text-sm text-center text-gray-800 mb-2 font-semibold">
                {range[0]} - {range[1]} {unit}
            </Typography>

            {/* ✅ スライダー */}
            <Slider
                value={range}
                onChange={handleChange}
                onChangeCommitted={handleApply}
                valueLabelDisplay="off"
                min={min}
                max={max}
                step={step}
            />
        </Box>
    );
}
