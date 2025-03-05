// src/app/p/customer/castprof/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Container, CircularProgress, Box } from "@mui/material";
import CastProfile from "./components/profile/CastProfile";
import { useProfile } from "./hooks/useProfile";
import ErrorMessage from "./components/common/ErrorMessage"; // ✅ 修正後の `ErrorMessage.tsx` を使用

export default function CastProfilePage() {
    const { id } = useParams();
    const castId = Number(id);
    const { profile, loading, error } = useProfile(castId);

    if (loading) return <CircularProgress />;
    if (error === "invalidId") return <ErrorMessage missingId={true} />; // ✅ `missingId` を渡す
    if (error) return <ErrorMessage message={error} />;
    if (!profile) return <ErrorMessage message="キャストが見つかりません" />;

    return (
        <CastProfile profile={profile} />
    );
}
