const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(";").shift() || null : null;
};

const GetGenerateUrl = async (fileName: string, fileType: string, targetType: string, targetId: number, orderIndex: number) => {
  const token = getCookie("token");
  
  if (!token) {
    throw new Error("認証トークンがありません。ログインしてください。");
  }

  const res = await fetch(`${apiUrl}/api/v1/media/upload/generate-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      file_name: fileName,
      file_type: fileType,
      target_type: targetType,
      target_id: targetId,
      order_index: orderIndex,
    }),
  });

  if (!res.ok) {
    throw new Error("署名付きURLの取得に失敗しました。");
  }

  const data = await res.json();
  return data.presigned_url;
};

export default GetGenerateUrl;
