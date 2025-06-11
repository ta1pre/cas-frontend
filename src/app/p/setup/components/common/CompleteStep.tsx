import { useState, useEffect } from "react";
import { Button, CircularProgress, Box, Typography, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { getCookie } from '../../utils/cookieUtils';
import { useSetupStorage } from "@/app/p/setup/hooks/storage/useSetupStorage";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const sendProfileData = async (
  token: string,
  userId: number,
  userType: string,
  profileData: any,
  castType?: string
): Promise<string> => {
  // データ必須チェック（token は fetchAPI で自動付与されるが念のため）
  if (!userId || !userType || !profileData) {
    console.error("❌ `sendProfileData` に必要なデータが不足しています", { token, userId, userType, profileData, castType });
    return "送信データが不足しています";
  }

  try {
    // ペイロード構築
    const payload = castType
      ? { user_id: userId, user_type: userType, cast_type: castType, profile_data: profileData }
      : { user_id: userId, user_type: userType, profile_data: profileData };

    // ✅ fetchAPI 経由で送信（Authorization 自動）
    const response: any = await fetchAPI("/api/v1/setup/status/update", payload);

    if (!response) {
      throw new Error("API レスポンスが null です");
    }

    console.log("✅ プロフィールデータ送信成功:", response);
    return response.message || "成功";
  } catch (error) {
    console.error("❌ プロフィールデータ送信に失敗:", error);
    return "プロフィールデータ送信に失敗しました";
  }
};

export default function CompleteStep() {
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const user = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [castType, setCastType] = useState<string | null>(null);
  const router = useRouter();
  const { getStorage } = useSetupStorage();

  useEffect(() => {
    if (user?.token && user?.user_id) {
      setToken(user.token);
      setUserId(user.user_id);
    }
  }, [user]);

  useEffect(() => {
    if (!token || !userId) {
      console.warn("⚠️ `token` または `userId` が未取得のため、処理をスキップ");
      return;
    }

    console.log("🔄 認証情報を取得:", { userId, token });

    const profileDataString = getStorage("profile_data");
    const storedUserType = getStorage("user_type");

    let castTypeValue: string | null = null;
    const startPageRaw = getCookie('StartPage');
    let startPage = startPageRaw;
    if (startPageRaw) {
      try {
        startPage = decodeURIComponent(startPageRaw);
      } catch (e) {
        // デコード失敗時はそのまま
        startPage = startPageRaw;
      }
    }
    if (startPage && startPage.startsWith('cast:')) {
      const parts = startPage.split(':');
      if (parts.length === 2) {
        castTypeValue = parts[1]; // 例: 'cas'や'delicas'
      }
    }
    setCastType(castTypeValue);

    if (!profileDataString || profileDataString === "null" || !storedUserType || storedUserType === "null") {
      console.warn("⚠️ `profile_data` または `user_type` が見つかりません", { profileDataString, storedUserType });
      setProfileMessage("プロフィールデータがありません");
      return;
    }

    setProfileData(JSON.parse(profileDataString));
    setUserType(storedUserType);
  }, [token, userId]);

  useEffect(() => {
    if (!token || !userId || !userType || !profileData) {
      console.warn("⚠️ `sendProfileData` の実行条件を満たしていません", { token, userId, userType, profileData });
      return;
    }

    console.log("🚀 送信データ:", { userId, userType, castType, profileData });

    sendProfileData(token, userId, userType, profileData, castType || undefined)
      .then(setProfileMessage)
      .catch(() => setProfileMessage("プロフィールデータ送信に失敗しました"));
  }, [token, userId, userType, profileData, castType]);

  return (
    <Container maxWidth="md">
      {/* コンテンツエリア */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          px: 3,
          py: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          セットアップ完了！
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 4 }}>お疲れ様でした。</Typography>

        {profileMessage ? (
          <Typography sx={{ color: "success.main", fontWeight: "medium" }}>{profileMessage}</Typography>
        ) : (
          <CircularProgress sx={{ color: "primary.main" }} />
        )}

        <Box sx={{ width: "100%", maxWidth: 360, mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {userType === "customer" && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => router.push("/p/customer/search")}
            >
              メインページへ
            </Button>
          )}
          {userType === "cast" && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => router.push("/p/cast/cont/dashboard")}
            >
              メインページへ
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
