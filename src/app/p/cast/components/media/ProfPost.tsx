"use client";

import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import GetExistingMedia from "@/app/p/cast/components/media/common/GetExistingMedia";
import HandleMediaUpload from "@/app/p/cast/components/media/common/HandleMediaUpload";
import DeleteMedia from "@/app/p/cast/components/media/common/DeleteMedia";

interface ProfPostProps {
  orderIndex: number;
  onUploadComplete: () => void;
}

const ProfPost = ({ orderIndex, onUploadComplete }: ProfPostProps) => {
  const user = useUser();
  const targetId = user?.user_id ?? null;
  const [uploadedUrl, setUploadedUrl] = useState("");
  const targetType = "profile_common"; // ✅ プロフィール画像用

  useEffect(() => {
    if (targetId) {
      GetExistingMedia(targetType, targetId, orderIndex).then(existingMedia => {
        if (existingMedia.length > 0) {
          setUploadedUrl(existingMedia[0].file_url);
        } else {
          console.log(`ℹ️ 既存の画像なし: orderIndex=${orderIndex}`);
        }
      });
    }
  }, [targetId]);

  const handleUpload = async (file: File) => {
    if (!targetId) {
      console.error("❌ ユーザーID取得不可。アップロード中止");
      return;
    }
    try {
      const fileUrl = await HandleMediaUpload(file, targetType, targetId, orderIndex);
      setUploadedUrl(fileUrl);
      onUploadComplete();
    } catch (error) {
      console.error("アップロード失敗:", error);
    }
  };

  const handleDeleteClick = async () => {
    if (!targetId) {
      console.error("❌ ユーザーID取得不可。削除中止");
      return;
    }
    try {
      await DeleteMedia(targetType, targetId, orderIndex);
      setUploadedUrl(""); // ✅ 削除後にリセット
      onUploadComplete();
    } catch (error) {
      console.error("❌ 画像削除失敗:", error);
    }
  };

    return (
    <div className="flex justify-center">
        <div className="relative w-full max-w-xs h-56 border-2 border-dashed border-gray-400 flex items-center justify-center mb-4 rounded-lg overflow-hidden">
        {uploadedUrl ? (
            <>
            <img src={uploadedUrl} alt={`プロフィール画像 ${orderIndex + 1}`} className="w-full h-full object-cover" />
            <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
            >
                ✕
            </button>
            </>
        ) : (
            <label className="w-full h-full flex items-center justify-center cursor-pointer">
            <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => e.target.files && e.target.files[0] && handleUpload(e.target.files[0])}
                className="hidden"
            />
            <span className="text-gray-500 text-2xl">＋</span>
            </label>
        )}
        </div>
    </div>
    );
};

export default ProfPost;
