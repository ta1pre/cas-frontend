import React, { useState } from "react";
import { useFiltersState } from "../search_options/state/FiltersState";
import { FilterUIComponents } from "./FilterUIComponents";
import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function FiltersContainer() {
    const { selectedFilters, updateFilter } = useFiltersState();
    const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(null);

    // ✅ 選択されたフィルターのコンポーネントを取得
    const SelectedComponent = selectedFilterKey ? FilterUIComponents[selectedFilterKey] : null;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">絞り込み</h3>
            <div className="space-y-4">
                {Object.keys(FilterUIComponents).map((key) => (
                    <Button
                        key={key}
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: selectedFilters[key] ? "#1976D2" : "#E0E0E0",
                            color: selectedFilters[key] ? "white" : "black",
                        }}
                        onClick={() => setSelectedFilterKey(key)}
                    >
                        {selectedFilters[key] ? `${key} 選択済み` : `${key} を選択`}
                    </Button>
                ))}
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
                    },
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" className="font-bold">{selectedFilterKey} を選択</Typography>
                    <IconButton onClick={() => setSelectedFilterKey(null)} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* ✅ 選択されたフィルターの UI を安全に表示 */}
                {SelectedComponent && selectedFilterKey && (
                    <SelectedComponent
                        filterKey={selectedFilterKey}
                        value={selectedFilters[selectedFilterKey] ?? undefined}
                        onChange={(value: any) => {
                            console.log(`🔍 フィルター変更: ${selectedFilterKey} =`, value);
                            console.log("更新前の selectedFilters:", selectedFilters);
                            
                            updateFilter(selectedFilterKey!, value);
                            
                            console.log("更新後の selectedFilters:", { 
                                ...selectedFilters, 
                                [selectedFilterKey!]: value 
                            });

                            // ✅ 都道府県選択後に、現在のフィルター状態を表示
                            console.log("現在のフィルター状態:", selectedFilters);
                        }}
                    />
                )}
            </Drawer>
        </div>
    );
}
