// 📂 src/app/p/customer/area/components/StationSuggestSelector.tsx
"use client";

import { useState } from "react";
import fetchStationSuggest from "../api/fetchStationSuggest";
import registerSuggestedStation from "../api/registerSuggestedStation";
import { Autocomplete, TextField } from "@mui/material";

interface Station {
    id: number;
    name: string;
    lineName: string;
}

interface Props {
    onStationSelect: (station: Station) => void; // ✅ 親コンポーネントに駅情報を渡す
    defaultStation?: Station; 
}

export default function StationSuggestSelector({ onStationSelect }: Props) {
    const [inputValue, setInputValue] = useState<string>("");
    const [options, setOptions] = useState<Station[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.length >= 2) {
            setLoading(true);
            const stations: Station[] = await fetchStationSuggest(value);
            setOptions(stations);
            setLoading(false);
        } else {
            setOptions([]);
        }
    };

    const handleStationSelect = async (
        event: any,
        newValue: Station | null
    ) => {
        if (newValue) {
            await registerSuggestedStation(newValue.id);
            onStationSelect(newValue); // ✅ 親に選択した駅を渡す
        }
    };

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.name}（${option.lineName}）`} // ✅ 型エラー解消
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="駅名を入力"
                    variant="outlined"
                    onChange={handleInputChange}
                    fullWidth
                />
            )}
            onChange={(event, newValue) => handleStationSelect(event, newValue as Station | null)} // ✅ `as Station | null` を追加
            loading={loading}
            freeSolo={false}
            noOptionsText="駅が見つかりません"
        />
    );
}
