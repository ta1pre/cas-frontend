"use client";

import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Autocomplete, TextField, Button } from "@mui/material";
import { fetchStation } from "../api/getStation";
import fetchStationSuggest from "@/app/p/customer/area/api/fetchStationSuggest";
import { StationResponse, SuggestedStationData } from "../api/types";
import CheckIcon from "@mui/icons-material/Check";

interface StationSelectorProps {
    userId: number;
    castId: number;
    onSelectStation: (stationId: number | null) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({ userId, castId, onSelectStation }) => {
    const [stations, setStations] = useState<StationResponse | null>(null);
    const [selectedStation, setSelectedStation] = useState<number | null>(null);
    const [selectedStationName, setSelectedStationName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [customStationOpen, setCustomStationOpen] = useState<boolean>(false);
    const [suggestedStations, setSuggestedStations] = useState<SuggestedStationData[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        async function loadStationData() {
            const data = await fetchStation(userId, castId);
            if (data) {
                setStations({ ...data });

                if (data.cast_station?.station_id) {
                    setSelectedStation(data.cast_station.station_id);
                    setSelectedStationName(`${data.cast_station.station_name}駅（キャストの最寄り駅）`);
                    onSelectStation(data.cast_station.station_id);
                } else if (data.user_station?.station_id) {
                    setSelectedStation(data.user_station.station_id);
                    setSelectedStationName(`${data.user_station.station_name}駅（あなたの最寄り駅）`);
                    onSelectStation(data.user_station.station_id);
                }
            }
            setLoading(false);
        }
        loadStationData();
    }, [userId, castId, onSelectStation]);

    const handleStationChange = (stationId: number | null, stationName: string | null) => {
        setSelectedStation(stationId);
        setSelectedStationName(stationName);
        setCustomStationOpen(false);
        onSelectStation(stationId);
    };

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.length >= 2) {
            const fetchedStations = await fetchStationSuggest(value);
            setSuggestedStations(
                fetchedStations.map((station) => ({
                    station_id: station.id,
                    station_name: station.name,
                    line_name: station.lineName,
                }))
            );
        } else {
            setSuggestedStations([]);
        }
    };

    const handleCustomStationSelect = (event: any, newValue: SuggestedStationData | null) => {
        if (newValue) {
            setSelectedStation(newValue.station_id);
            setSelectedStationName(`${newValue.station_name}駅（カスタム）`);
            setCustomStationOpen(false);
            onSelectStation(newValue.station_id);
        }
    };

    return (
        <Box className="w-full bg-white rounded-lg shadow">
            {/* 帯付きのタイトル */}
            <Box
                className="px-4 py-2 rounded-t-lg"
                sx={{ backgroundColor: "#fce7f3", borderBottom: "2px solid #ec4899" }}
            >
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ec4899" }}>
                    最寄り駅を選択
                </Typography>
            </Box>

            {/* 内側の余白調整 */}
            <Box className="p-4">
                {loading ? (
                    <CircularProgress size={24} className="mt-2" />
                ) : (
                    <>
                        {stations?.cast_station && (
                            <Button
                                fullWidth
                                sx={{
                                    py: 2,
                                    my: 1,
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    backgroundColor:
                                        selectedStation === stations.cast_station.station_id ? "#ec4899" : "#e5e7eb",
                                    color: selectedStation === stations.cast_station.station_id ? "#fff" : "#696969",
                                    "&:hover": {
                                        backgroundColor:
                                            selectedStation === stations.cast_station.station_id ? "#db2777" : "#d1d5db",
                                    },
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                onClick={() =>
                                    handleStationChange(
                                        stations.cast_station?.station_id ?? null,
                                        stations.cast_station
                                            ? `${stations.cast_station.station_name}駅（キャストの最寄り駅）`
                                            : null
                                    )
                                }
                            >
                                {`${stations.cast_station.station_name}駅（最速！）`}
                                {selectedStation === stations.cast_station.station_id && <CheckIcon />}
                            </Button>
                        )}

                        {stations?.user_station && (
                            <Button
                                fullWidth
                                sx={{
                                    py: 2,
                                    my: 1,
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    backgroundColor:
                                        selectedStation === stations.user_station.station_id ? "#ec4899" : "#e5e7eb",
                                    color: selectedStation === stations.user_station.station_id ? "#fff" : "#696969",
                                    "&:hover": {
                                        backgroundColor:
                                            selectedStation === stations.user_station.station_id ? "#db2777" : "#d1d5db",
                                    },
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                onClick={() =>
                                    handleStationChange(
                                        stations.user_station?.station_id ?? null,
                                        stations.user_station
                                            ? `${stations.user_station.station_name}駅（あなたの最寄り駅）`
                                            : null
                                    )
                                }
                            >
                                {`${stations.user_station.station_name}駅（あなたの最寄り駅）`}
                                {selectedStation === stations.user_station.station_id && <CheckIcon />}
                            </Button>
                        )}

                        <Button
                            fullWidth
                            sx={{
                                py: 2,
                                my: 1,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                backgroundColor:
                                    selectedStation && selectedStationName?.includes("カスタム")
                                        ? "#ec4899"
                                        : "#e5e7eb",
                                color:
                                    selectedStation && selectedStationName?.includes("カスタム")
                                        ? "#fff"
                                        : "#696969",
                                "&:hover": {
                                    backgroundColor:
                                        selectedStation && selectedStationName?.includes("カスタム")
                                            ? "#db2777"
                                            : "#d1d5db",
                                },
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                            onClick={() => setCustomStationOpen(true)}
                        >
                            {selectedStationName?.includes("カスタム") ? selectedStationName : "駅を選ぶ"}
                            {selectedStation && selectedStationName?.includes("カスタム") ? <CheckIcon /> : null}
                        </Button>

                        {customStationOpen && (
                            <Autocomplete
                                options={suggestedStations}
                                getOptionLabel={(option) => `${option.station_name}（${option.line_name}）`}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="駅名を入力"
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                )}
                                onChange={handleCustomStationSelect}
                                noOptionsText="駅が見つかりません"
                            />
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default StationSelector;
