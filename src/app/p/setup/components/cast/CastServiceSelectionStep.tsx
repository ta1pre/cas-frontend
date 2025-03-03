// File: src/app/p/setup/components/cast/CastServiceSelectionStep.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import BasicServiceType from "@/app/p/cast/components/servicetype/components/BasicServiceType";
import { useServiceType } from "@/app/p/cast/components/servicetype/hooks/useServiceType";

interface Props {
    onNextStep: () => void;
}

const CastServiceSelectionStep: React.FC<Props> = ({ onNextStep }) => {
    const { selectedServiceTypes } = useServiceType();
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [selectedServiceNames, setSelectedServiceNames] = useState<string[]>([]);
    const [isNextEnabled, setIsNextEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ 初回データ取得
    useEffect(() => {
        setTimeout(() => {
            console.log("✅ 初回取得データ:", selectedServiceTypes);
            setSelectedServices(selectedServiceTypes);
            setIsNextEnabled(selectedServiceTypes.length > 0);
            setIsLoading(false);
        }, 0);
    }, [selectedServiceTypes]);

    // ✅ サービス選択時の処理
    const handleServiceChange = (updatedServices: number[], updatedNames: string[]) => {
        console.log("✅ 更新後のサービス選択:", updatedServices, updatedNames);
        setSelectedServices(updatedServices);
        setSelectedServiceNames(updatedNames);
        setIsNextEnabled(updatedServices.length > 0);
    };

    // ✅ 「次へ」ボタンの処理
    const handleNext = () => {
        if (selectedServices.length === 0) return;
        onNextStep();
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                gap: 3,
                px: 3,
            }}
        >
            {/* タイトル */}
            <Typography variant="h5" fontWeight="bold">
                提供できるサービスを選択
            </Typography>

            {/* ✅ 選択状態の表示 */}
            <Typography variant="body1" color={selectedServices.length > 0 ? "success.main" : "error.main"}>
                {isLoading
                    ? "🔄 読み込み中..."
                    : selectedServices.length > 0
                        ? `✅ 選択済み: ${selectedServiceNames.join(", ")}`
                        : "⚠️ 1つ以上選択してください"}
            </Typography>

            {/* サービスタイプ選択 */}
            {isLoading ? (
                <CircularProgress />
            ) : (
                <BasicServiceType onServiceChange={handleServiceChange} />
            )}

            {/* 「次へ」ボタン */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNext}
                disabled={isLoading || !isNextEnabled}
                sx={{ mt: 2 }}
            >
                次へ
            </Button>
        </Box>
    );
};

export default CastServiceSelectionStep;
