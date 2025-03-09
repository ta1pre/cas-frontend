// 📂 src/app/p/customer/area/components/PrefectureSelector.tsx
"use client";

import { useEffect, useState } from "react";
import fetchPrefectures from "../api/getPrefectures";
import registerPrefecture from "../api/registerPrefecture";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export default function PrefectureSelector() {
    const [prefectures, setPrefectures] = useState<{ id: number; name: string }[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState<number | "">("");

    useEffect(() => {
        async function fetchData() {
            const data = await fetchPrefectures();
            setPrefectures(data);
        }
        fetchData();
    }, []);

    const handleChange = async (event: any) => {
        const newPrefectureId = event.target.value;
        setSelectedPrefecture(newPrefectureId);

        // ✅ 登録 API を呼ぶ
        const response = await registerPrefecture(newPrefectureId);
        if (response) {
            console.log("✅ 登録完了！");
        }
    };

    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">🏙 都道府県を選択</h2>
            <FormControl fullWidth className="mt-2">
                <InputLabel id="prefecture-label">都道府県</InputLabel>
                <Select
                    labelId="prefecture-label"
                    value={selectedPrefecture}
                    onChange={handleChange}
                >
                    {prefectures.map((pref) => (
                        <MenuItem key={pref.id} value={pref.id}>
                            {pref.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
