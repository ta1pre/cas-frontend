import { useState, useEffect } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * ✅ `profile_data` を取得し、API に送信する
 */
export const sendProfileData = async (
  token: string, 
  userId: number, 
  userType: string, 
  profileData: any
): Promise<string> => {
  if (!token || !userId || !userType || !profileData) {
    console.error("❌ `sendProfileData` に必要なデータが不足しています", { token, userId, userType, profileData });
    return "送信データが不足しています";
  }

  try {
    const response = await axios.post(`${apiUrl}/api/v1/setup/status/update`, 
      { user_id: userId, user_type: userType, profile_data: profileData },
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    console.log("✅ プロフィールデータ送信成功:", response.data);
    return response.data.message || "成功";
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

    // ✅ `localStorage` から `profile_data` と `user_type` を取得
    const profileDataString = localStorage.getItem("profile_data");
    const storedUserType = localStorage.getItem("user_type");

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

    console.log("🚀 送信データ:", { userId, userType, profileData });

    sendProfileData(token, userId, userType, profileData)
      .then(setProfileMessage)
      .catch(() => setProfileMessage("プロフィールデータ送信に失敗しました"));

  }, [token, userId, userType, profileData]);

  return (
    <div>
      <h2>セットアップ完了！</h2>
      <p>お疲れ様でした。</p>
      {profileMessage && <p>プロフィール更新: {profileMessage}</p>}
    </div>
  );
}
