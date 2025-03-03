"use client";

import { useState, useEffect } from "react";
import { useServiceType } from "../hooks/useServiceType";
import { Button, IconButton, Popover, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface Props {
    onServiceChange?: (updatedServices: number[], updatedNames: string[]) => void; // ✅ 名前の配列も通知
}

export default function BasicServiceType({ onServiceChange }: Props) {
    const { serviceTypesByCategory, selectedServiceTypes, error, toggleServiceType } = useServiceType();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentDescription, setCurrentDescription] = useState<string>("");

    useEffect(() => {
        console.log("初期選択状態:", selectedServiceTypes);
    }, []);

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, description: string | null) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setCurrentDescription(description ?? "説明がありません");
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setCurrentDescription("");
    };

    // ✅ サービスの選択変更時に親コンポーネントへ通知
    const handleToggleService = (serviceId: number, serviceName: string) => {
        toggleServiceType(serviceId);
        const updatedServices = selectedServiceTypes.includes(serviceId)
            ? selectedServiceTypes.filter(id => id !== serviceId)
            : [...selectedServiceTypes, serviceId];

        const updatedNames = updatedServices.map(id => {
            const service = Object.values(serviceTypesByCategory)
                .flat()
                .find(service => service.id === id);
            return service ? service.name : "";
        });

        console.log("最新の選択状態:", updatedServices, updatedNames);

        if (onServiceChange) {
            onServiceChange(updatedServices, updatedNames);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}

            {!error && Object.keys(serviceTypesByCategory).length > 0 && (
                <div className="mt-4">
                    {Object.entries(serviceTypesByCategory).map(([category, services]) => (
                        <div key={category} className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">{category}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {services.map((service) => (
                                    <div key={service.id} className="flex items-center w-full p-1">
                                        {/* ✅ ボタン */}
                                        <Button
                                            variant={selectedServiceTypes.includes(service.id) ? "contained" : "outlined"}
                                            color="primary"
                                            className="flex-1 text-sm px-4 py-2 shadow-sm"
                                            onClick={() => handleToggleService(service.id, service.name)}
                                        >
                                            {service.name}
                                        </Button>

                                        {/* ✅ `!` アイコン */}
                                        {service.description && (
                                            <IconButton
                                                size="small"
                                                className="ml-1 bg-white p-1 rounded-full"
                                                onClick={(e) => handleOpenPopover(e, service.description)}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ `Popover`（説明表示） */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <Typography className="p-2">{currentDescription}</Typography>
            </Popover>
        </div>
    );
}
