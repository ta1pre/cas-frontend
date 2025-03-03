import React, { useState } from "react";
import { useFiltersState } from "../search_options/state/FiltersState";
import { FilterUIComponents } from "./FilterUIComponents";
import { Drawer, Box, IconButton, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/ExpandMore"; // ✅ 下向き不等号（∨）

export default function FiltersContainer() {
    const { selectedFilters, updateFilter } = useFiltersState();
    const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(null);

    // ✅ 選択中のフィルターコンポーネントを取得
    const SelectedComponent = selectedFilterKey ? FilterUIComponents[selectedFilterKey]?.component : null;
    const SelectedLabel = selectedFilterKey ? FilterUIComponents[selectedFilterKey]?.label : "";

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex flex-col gap-3">
                {Object.entries(FilterUIComponents).map(([key, { label }]) => {
                    const isSet = selectedFilters[key] !== undefined; // ✅ 設定済みか判定

                    return (
                <Button
                    key={key}
                    fullWidth
                    variant={isSet ? "contained" : "outlined"}
                    className="py-2 text-sm flex justify-between items-center"
                    color={isSet ? "primary" : "inherit"}
                    onClick={() => setSelectedFilterKey(key)}
                >
                    <span>{label}</span>
                    {isSet && <span className="text-xs text-white bg-green-500 px-2 py-1 rounded-md ml-2">設定済み</span>} {/* ✅ 余白を追加 */}
                </Button>
                    );
                })}
            </div>

            {/* 選択したフィルターの詳細モーダル */}
            <Drawer
                anchor="bottom"
                open={!!selectedFilterKey}
                onClose={() => setSelectedFilterKey(null)}
                sx={{
                    "& .MuiDrawer-paper": {
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px",
                        padding: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        maxWidth: "500px",
                        margin: "0 auto",
                        height: "80vh", // ✅ モーダルの高さを調整
                    },
                }}
            >
                {/* モーダルヘッダー（見出し＋下向き不等号で閉じる） */}
                <Box display="flex" justifyContent="space-between" alignItems="center" className="border-b pb-2">
                    <Typography className="font-semibold text-lg">{SelectedLabel}</Typography>
                    <IconButton onClick={() => setSelectedFilterKey(null)} size="small">
                        <CloseIcon /> {/* ✅ 「∨」ボタンで閉じる */}
                    </IconButton>
                </Box>

                {/* ✅ 選択されたフィルターの UI を表示 */}
                {/* ✅ 選択されたフィルターの UI を表示 */}
                {SelectedComponent && (
                    <Box className="p-4">
                        {/* ✅ 設定済み表示 */}
                        {selectedFilters[selectedFilterKey!] !== undefined && (
                            <Typography className="text-sm text-green-500 font-semibold text-center mb-2">
                                設定済み ✅
                            </Typography>
                        )}

                        <SelectedComponent
                            filterKey={selectedFilterKey!}
                            value={selectedFilters[selectedFilterKey!] ?? undefined}
                            onChange={(value: any) => {
                                updateFilter(selectedFilterKey!, value);
                            }}
                        />

                        {/* ✅ クリアボタンの位置を適切に調整 */}
                        <Box className="mt-10">
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                className="border-gray-500 text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    updateFilter(selectedFilterKey!, undefined);
                                    setSelectedFilterKey(null);
                                }}
                            >
                                クリア
                            </Button>
                        </Box>
                    </Box>
                )}

            </Drawer>
        </div>
    );
}
