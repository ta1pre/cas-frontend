// src/app/p/customer/search/components/search_options/panels/FiltersModal.tsx
import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
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
                    backdropFilter: "blur(10px)",
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" className="font-bold">絞り込み</Typography>
                <IconButton onClick={closeFilters} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* ✅ 絞り込みフィルター UI を統合 */}
            <FiltersContainer />

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button 
                    variant="outlined" 
                    onClick={() => {
                        resetFilters();
                        applyFilters();
                        setOffset(0);
                    }}
                >
                    リセット
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => {
                        applyFilters();
                        setOffset(0);
                        closeFilters();
                    }}
                >
                    この条件で検索
                </Button>
            </Box>
        </Drawer>
    );
}
