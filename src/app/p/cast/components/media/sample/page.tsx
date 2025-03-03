"use client";

import { useState } from "react";
import ProfPost from "@/app/p/cast/components/media/ProfPost";
import useMediaStatus from "@/app/p/cast/components/media/common/useMediaStatus";
import useUser from "@/hooks/useUser";
import { Container, Typography, Box } from "@mui/material";

const Page = () => {
  const user = useUser();
  const targetType = "profile_common";
  const targetId = user?.user_id ?? null;
  const orderIndexes = [0, 1, 2, 3, 4, 5];

  const [uploadTrigger, setUploadTrigger] = useState(0);
  const mediaStatus = useMediaStatus(targetType, targetId, orderIndexes, uploadTrigger);
  const isMainUploaded = mediaStatus[0] || false;

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          📸 プロフィール画像アップロード
        </Typography>
        <Typography variant="body1" color={isMainUploaded ? "success.main" : "error.main"}>
          {isMainUploaded ? "✅ メイン画像がアップロードされています" : "⚠️ メイン画像をアップロードしてね"}
        </Typography>
      </Box>

      {/* ✅ 画像リストのグリッドレイアウト */}
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} justifyContent="center">
        {orderIndexes.map((index) => (
          <ProfPost
            key={index}
            orderIndex={index}
            onUploadComplete={() => setUploadTrigger((prev) => prev + 1)}
          />
        ))}
      </Box>
    </Container>
  );
};

export default Page;
