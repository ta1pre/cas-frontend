// src/app/p/customer/search/components/search_options/filters/CheckboxFilter.tsx

import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";

interface CheckboxFilterProps {
    filterKey: string;
    value?: boolean;
    label: string;
    onChange: (value: boolean) => void;
}

export default function CheckboxFilter({ filterKey, value, label, onChange }: CheckboxFilterProps) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={value || false}
                    onChange={(e) => onChange(e.target.checked)}
                />
            }
            label={label}
        />
    );
}
