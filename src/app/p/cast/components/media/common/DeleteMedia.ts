const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  const cookieValue = parts.length === 2 ? parts.pop() ?? null : null; // ✅ 修正
  return cookieValue ? cookieValue.split(";").shift() ?? null : null; // ✅ 修正
};


const DeleteMedia = async (targetType: string, targetId: number, orderIndex: number) => {
  try {
    console.log("🗑️ 画像を削除:", { targetType, targetId, orderIndex });

    // ✅ 認証トークンを取得
    const token = getCookie("token");
    if (!token) {
      console.warn("⚠️ 認証トークンがありません。ログインしてください。");
      return;
    }

    const res = await fetch(`${apiUrl}/api/v1/media/upload/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        target_type: targetType,
        target_id: targetId,
        order_index: orderIndex,
      }),
    });

    if (!res.ok) {
      throw new Error("画像の削除に失敗しました。");
    }

    console.log("✅ 画像削除成功");
  } catch (error) {
    console.error("❌ 画像削除エラー:", error);
    throw error;
  }
};

export default DeleteMedia;
