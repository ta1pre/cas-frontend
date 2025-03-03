import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import GetExistingMedia from "./GetExistingMedia";
import HandleMediaUpload from "./HandleMediaUpload";
import DeleteMedia from "./DeleteMedia";

const useMediaHandler = (targetType: string, orderIndex: number) => {
  const user = useUser();
  const targetId = user?.user_id ?? null;
  const [uploadedUrl, setUploadedUrl] = useState("");

  useEffect(() => {
    if (targetId) {
      GetExistingMedia(targetType, targetId, orderIndex).then(existingMedia => {
        if (existingMedia.length > 0) {
          setUploadedUrl(existingMedia[0].file_url);
        }
      });
    }
  }, [targetId, targetType, orderIndex]);  // ✅ `targetType` を依存配列に追加

  const handleUploadSuccess = async (file: File) => {
    if (!targetId) return console.error("❌ ユーザーIDが取得できません。アップロードを中止します。");
    try {
      const fileUrl = await HandleMediaUpload(file, targetType, targetId, orderIndex);
      setUploadedUrl(fileUrl);
    } catch (error) {
      console.error("アップロードに失敗:", error);
    }
  };

  const handleDelete = async () => {
    if (!targetId) return console.error("❌ ユーザーIDが取得できません。削除を中止します。");
    try {
      await DeleteMedia(targetType, targetId, orderIndex);
      setUploadedUrl(""); // ✅ 削除後にプレビューをリセット
    } catch (error) {
      console.error("❌ 画像削除失敗:", error);
    }
  };

  return { uploadedUrl, handleUploadSuccess, handleDelete, targetId };
};

export default useMediaHandler;
