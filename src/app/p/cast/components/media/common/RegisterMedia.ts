const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(";").shift() || null : null;
};

const RegisterMedia = async (fileUrl: string, fileType: string, targetType: string, targetId: number, orderIndex: number) => {
  try {
    console.log("📝 DBに画像情報を登録開始:", { fileUrl, fileType, targetType, targetId, orderIndex });

    // ✅ 認証トークンを取得
    const token = getCookie("token");
    if (!token) {
      console.warn("⚠️ 認証トークンがありません。ログインしてください。");
      return;
    }

    const res = await fetch(`${apiUrl}/api/v1/media/upload/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // ✅ 認証ヘッダーを追加
      },
      body: JSON.stringify({
        file_url: fileUrl,
        file_type: fileType,
        target_type: targetType,
        target_id: targetId,
        order_index: orderIndex,
      }),
    });

    if (res.status === 403) {
      console.error("❌ 認証エラー (403 Forbidden): トークンが無効または不足しています。");
      return;
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ DB 登録エラー:", errorText);
      throw new Error("DB への登録に失敗しました。");
    }

    const data = await res.json();
    console.log("✅ DB 登録成功:", data);
    return data;
  } catch (error) {
    console.error("❌ RegisterMedia.ts 内のエラー:", error);
    throw error;
  }
};

export default RegisterMedia;
