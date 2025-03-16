"use client";

import { useState, useEffect } from "react";
import fetchStationSuggest from "../api/fetchStationSuggest";
import registerSuggestedStation from "../api/registerSuggestedStation";
import { Autocomplete, TextField, CircularProgress, Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import TrainIcon from "@mui/icons-material/Train";

interface Station {
    id: number;
    name: string;
    lineName: string;
}

interface Props {
    onStationSelect: (station: Station) => void;
    defaultStation?: Station;
    resetTrigger?: boolean; // ✅ タブ切り替え時のリセット用トリガー
}

export default function StationSuggestSelector({ onStationSelect, resetTrigger }: Props) {
    const [inputValue, setInputValue] = useState<string>("");
    const [options, setOptions] = useState<Station[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    // ✅ タブ切り替え時にリセット
    useEffect(() => {
        setInputValue("");
        setOptions([]);
        setSelectedStation(null);
    }, [resetTrigger]); // 🔥 resetTrigger の変更時にリセットする

    // ✅ 入力が変更された時の処理
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

    // ✅ 駅が選択された時の処理
    const handleStationSelect = async (event: any, newValue: Station | null) => {
        if (newValue) {
            await registerSuggestedStation(newValue.id);
            setSelectedStation(newValue);
            onStationSelect(newValue);
        }
    };

    return (
        <Box className="p-4 bg-white rounded-lg shadow-md">
            {/* ✅ タイトル（h2に変更 & GPS画面と統一） */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">駅を検索して追加</h2>

            {/* ✅ 駅検索の入力ボックス */}
            <Autocomplete
                options={options}
                getOptionLabel={(option) => `${option.name}駅（${option.lineName}）`}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="駅名を入力"
                        variant="outlined"
                        onChange={handleInputChange}
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                onChange={handleStationSelect}
                loading={loading}
                freeSolo={false}
                noOptionsText="🚉 駅が見つかりません"
            />

            {/* ✅ 選択された駅を GPS のスタイルに統一 */}
            {selectedStation && (
                <Box 
                    className="mt-4 p-3 bg-gray-100 rounded-lg flex justify-between items-center"
                >
                    <div className="flex items-center">
                        <TrainIcon className="text-gray-700 mr-2" />
                        <Typography variant="body1" className="font-semibold text-gray-900">
                            {selectedStation.name}駅（{selectedStation.lineName || "路線名不明"}）
                        </Typography>
                    </div>
                    <CheckIcon className="text-green-600" />
                </Box>
            )}
        </Box>
    );
}
