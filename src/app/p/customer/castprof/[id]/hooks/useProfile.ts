// src/app/p/customer/castprof/[id]/hooks/useProfile.ts
import { useEffect, useState } from "react";
import fetchProfile from "../api/getProfile"; // ✅ **リネームした関数を使用**
import { CastProfileResponse } from "../api/castprofTypes";

export function useProfile(castId: number) {
    const [profile, setProfile] = useState<CastProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(castId)) {
            setError("invalidId");
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                const response = await fetchProfile(castId); // ✅ **リネームした関数を使用**
                if (!response) {
                    setError("キャストが見つかりません");
                }
                setProfile(response);
            } catch (err) {
                setError("プロフィール情報の取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [castId]);

    return { profile, loading, error };
}
