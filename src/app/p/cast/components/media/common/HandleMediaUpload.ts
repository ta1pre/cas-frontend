import GetExistingMedia from "./GetExistingMedia";
import GetGenerateUrl from "./GetGenerateUrl";
import RegisterMedia from "./RegisterMedia";
import DeleteMedia from "./DeleteMedia"; 

const HandleMediaUpload = async (file: File, targetType: string, targetId: number, orderIndex: number) => {
  try {
    console.log("📤 画像アップロード開始:", { targetType, targetId, orderIndex });

    // ✅ 1. 既存の画像を取得
    const existingMedia = await GetExistingMedia(targetType, targetId, orderIndex);

    // ✅ 2. 既存の画像がある場合は削除
    if (existingMedia.length > 0) {
      console.log("🗑️ 既存の画像を削除:", existingMedia[0].file_url);
      await DeleteMedia(targetType, targetId, orderIndex);
    }

    // ✅ 3. 署名付きURLを取得
    const presignedUrl = await GetGenerateUrl(file.name, file.type, targetType, targetId, orderIndex);

    // ✅ 4. S3 にアップロード
    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadRes.ok) {
      throw new Error("S3 アップロードに失敗しました。");
    }

    const uploadedFileUrl = presignedUrl.split("?")[0];
    console.log("✅ S3 アップロード成功:", uploadedFileUrl);

    // ✅ 5. DB に登録
    await RegisterMedia(uploadedFileUrl, file.type, targetType, targetId, orderIndex);

    return uploadedFileUrl;
  } catch (error) {
    console.error("❌ アップロードエラー:", error);
    throw error;
  }
};

export default HandleMediaUpload;
