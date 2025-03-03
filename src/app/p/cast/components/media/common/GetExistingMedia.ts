const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(";").shift() || null : null;
};

const GetExistingMedia = async (targetType: string, targetId: number, orderIndex: number) => {
  try {
    console.log("🔍 既存のメディアを取得:", { targetType, targetId, orderIndex });

    // ✅ 認証トークンを取得
    const token = getCookie("token");
    if (!token) {
      console.warn("⚠️ 認証トークンがありません。ログインしてください。");
      return [];
    }

    const res = await fetch(`${apiUrl}/api/v1/media/upload/get-by-index`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // ✅ 認証ヘッダーを追加
      },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId,
        order_index: orderIndex,
      }),
    });

    if (res.status === 403) {
      console.warn("⚠️ 認証エラー (403 Forbidden): ログインが必要です。");
      return []; // ✅ 403 の場合は空リストを返す
    }

    if (!res.ok) {
      throw new Error(`既存のメディア取得に失敗しました (${res.status})`);
    }

    const data = await res.json();
    console.log("✅ 取得したメディア:", data);
    return data;
  } catch (error) {
    console.error("❌ 既存のメディア取得エラー:", error);
    return [];
  }
};

export default GetExistingMedia;
