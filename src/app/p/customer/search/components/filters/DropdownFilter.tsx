// src/app/p/customer/search/components/search_options/filters/DropdownFilter.tsx

import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material"; 

interface DropdownFilterProps {
    filterKey: string;
    value: string | undefined;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    label: string; 
}

export default function DropdownFilter({
    filterKey,
    value,
    onChange,
    options,
    label, 
}: DropdownFilterProps) {
    const [selectedValue, setSelectedValue] = useState<string>(value ?? ""); 

    useEffect(() => {
        if (value !== selectedValue) {
            setSelectedValue(value ?? "");
        }
    }, [value]);

    return (
        <FormControl fullWidth margin="dense" size="small">
            <InputLabel id={`${filterKey}-label`}>{label}</InputLabel>
            <Select
                labelId={`${filterKey}-label`}
                id={filterKey}
                value={selectedValue}
                label={label} 
                onChange={(e) => {
                    const newValue = e.target.value as string;
                    setSelectedValue(newValue);
                    onChange(newValue);
                }}
                sx={{
                    borderRadius: 2, 
                    backgroundColor: '#FFF0F5', 
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFC0CB', 
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF80AB', 
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF80AB', 
                    },
                    '.MuiSelect-select': {
                      paddingTop: '8px', 
                      paddingBottom: '8px',
                    }
                  }}
            >
                <MenuItem value="">
                    <em>{options.find(opt => opt.value === "")?.label || '指定なし'}</em>
                </MenuItem>
                {options.filter(opt => opt.value !== "").map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
