// File: frontapp/src/app/p/setup/flow/SetupFlow.tsx
"use client";

import React, { useEffect } from "react";
import { Container, CircularProgress,Box } from "@mui/material";
import { useSetupNavigation } from "../hooks/storage/useSetupNavigation";
import BackButton from "./BackButton";

// ✅ 各ステップのコンポーネント
import AgeVerificationStep from "../components/common/AgeVerificationStep";
import SexSelectionStep from "../components/common/SexSelectionStep";
import CustomerProfileStep from "../components/customer/CustomerProfileStep";
import CastNameStep from "../components/cast/CastNameStep";
import CastPhotoStep from "../components/cast/CastPhotoStep";
import CastAgeStep from "../components/cast/CastAgeStep";
import CastHeightStep from "../components/cast/CastHeightStep";
import CastTraitsStep from "../components/cast/CastTraitsStep";
import CastServiceSelectionStep from "../components/cast/CastServiceSelectionStep";
import SMSVerificationStep from "../components/common/SMSVerificationStep";
import CompleteStep from "../components/common/CompleteStep";

export default function SetupFlow() {
    const { setupStatus, setSetupStatus, handlePrevStep } = useSetupNavigation();

    // ✅ デバッグ用ログ出力
    useEffect(() => {
        console.log("現在の setupStatus:", setupStatus);
    }, [setupStatus]);

    // ✅ ローディング処理
    if (setupStatus === null) {
        console.log("setupStatus が null のため、ローディング画面を表示");
        return (
            <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    // ✅ `BackButton` を表示するかどうかを判定
    const shouldShowBackButton = setupStatus !== "empty" && setupStatus !== "completed";

    // ✅ ステップごとのコンポーネントを取得
    const getStepComponent = () => {
        console.log("現在のステップ:", setupStatus);
        switch (setupStatus) {
            case "empty":
                return <AgeVerificationStep onNextStep={() => setSetupStatus("sex_selection")} />;
            case "sex_selection":
                return <SexSelectionStep onNextStep={(gender) => setSetupStatus(gender === "male" ? "customer_profile" : "cast_name")} />;
            case "customer_profile":
                return <CustomerProfileStep onNextStep={() => setSetupStatus("sms_verification")} />;
            case "cast_name":
                return <CastNameStep onNextStep={() => setSetupStatus("cast_photo")} />;
            case "cast_photo":
                return <CastPhotoStep onNextStep={() => setSetupStatus("cast_age")} />;
            case "cast_age":
                return <CastAgeStep onNextStep={() => setSetupStatus("cast_height")} />;
            case "cast_height":
                return <CastHeightStep onNextStep={() => setSetupStatus("cast_traits")} />;
            case "cast_traits":
                return <CastTraitsStep onNextStep={() => setSetupStatus("service_selection")} />;
            case "service_selection":
                return <CastServiceSelectionStep onNextStep={() => setSetupStatus("sms_verification")} />;
            case "sms_verification":
                return <SMSVerificationStep onNextStep={() => setSetupStatus("completed")} />;
            case "completed":
                return <CompleteStep />;
            default:
                return <p>不明なステータスです。</p>;
        }
    };

    return (
<Container maxWidth="md">
    {/* 🔥 「戻る」ボタンのエリアを確保（最初・最後は visibility: hidden） */}
    <Box sx={{ height: "60px", display: "flex", alignItems: "center", justifyContent: "flex-start", visibility: shouldShowBackButton ? "visible" : "hidden" }}>
        {shouldShowBackButton && <BackButton onClick={handlePrevStep} />}
    </Box>

    {/* コンテンツエリア */}
    <Box>
        {getStepComponent()}
    </Box>
</Container>



    );
}
