import { Drawer, Box, IconButton, Button, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFilters } from "../context/FiltersContext";
import { useFiltersState } from "../state/FiltersState";
import FiltersContainer from "../../filters/FiltersContainer";

interface FiltersModalProps {
    setOffset: (offset: number) => void;
}

export default function FiltersModal({ setOffset }: FiltersModalProps) {
    const { isOpen, closeFilters } = useFilters();
    const { resetFilters, applyFilters } = useFiltersState();

    return (
        <Drawer
            anchor="bottom"
            open={isOpen}
            onClose={closeFilters}
            sx={{
                "& .MuiDrawer-paper": {
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    padding: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(12px)",
                    width: "100%",
                    maxWidth: "500px", // ✅ PC での見栄え調整
                    margin: "0 auto",
                },
            }}
        >
            {/* クローズボタンのみ */}
            <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={closeFilters} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* フィルターエリア */}
            <Box className="py-4">
                <FiltersContainer />
            </Box>

            <Divider />

            {/* ボタンエリア */}
            <Box mt={4} className="px-4 pb-4 flex flex-col gap-6"> {/* ✅ `gap-6` でしっかり間隔を開ける */}
                <Button 
                    variant="contained"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => {
                        applyFilters();
                        setOffset(0);
                        closeFilters();
                    }}
                >
                    決定
                </Button>
                <Button 
                    variant="outlined"
                    color="secondary"
                    className="w-full border-gray-500 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                        resetFilters();
                        applyFilters();
                        setOffset(0);
                    }}
                >
                    リセット
                </Button>
            </Box>
        </Drawer>
    );
}
