// src/app/p/customer/search/components/search_options/filters/RangeFilter.tsx

import React, { useState } from "react";
import { Slider, Typography, Box } from "@mui/material";

interface RangeFilterProps {
    filterKey: string;
    value?: [number, number];
    min: number;
    max: number;
    step?: number;
    onChange: (value: [number, number]) => void;
}

export default function RangeFilter({ filterKey, value, min, max, step = 1, onChange }: RangeFilterProps) {
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
        <Box>
            <Typography variant="subtitle1">{filterKey}</Typography>
            <Slider
                value={range}
                onChange={handleChange}
                onChangeCommitted={handleApply}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                step={step}
            />
            <Typography variant="body2">
                {range[0]} - {range[1]}
            </Typography>
        </Box>
    );
}
