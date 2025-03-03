// File: frontapp/src/app/p/setup/components/cast/CastPhotoStep.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ProfPost from '@/app/p/cast/components/media/ProfPost';
import useMediaStatus from '@/app/p/cast/components/media/common/useMediaStatus';
import useUser from '@/hooks/useUser';

interface Props {
    onNextStep: () => void;
}

export default function CastPhotoStep({ onNextStep }: Props): React.JSX.Element {
    const user = useUser();
    const targetType = "profile_common";
    const targetId = user?.user_id ?? null;
    const orderIndexes = [0, 1, 2, 3, 4, 5];

    const [uploadTrigger, setUploadTrigger] = useState(0);
    const mediaStatus = useMediaStatus(targetType, targetId, orderIndexes, uploadTrigger);
    const isMainUploaded = mediaStatus[0] || false; // ✅ メイン画像がアップロードされているか

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" my={4}>
                <Typography variant="h5" fontWeight="bold">
                    📸 プロフィール画像をアップロード
                </Typography>
                <Typography variant="body1" color={isMainUploaded ? "success.main" : "error.main"}>
                    {isMainUploaded ? "✅ メイン画像がアップロードされています" : "⚠️ メイン画像をアップロードしてね"}
                </Typography>
            </Box>

            {/* ✅ 画像アップロード用コンポーネント */}
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} justifyContent="center">
                {orderIndexes.map((index) => (
                    <ProfPost
                        key={index}
                        orderIndex={index}
                        onUploadComplete={() => setUploadTrigger((prev) => prev + 1)}
                    />
                ))}
            </Box>

            {/* ✅ 「次へ」ボタン */}
            <Box textAlign="center" mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onNextStep}
                    disabled={!isMainUploaded} // ✅ メイン画像がない場合はボタンを無効化
                >
                    次へ
                </Button>
            </Box>
        </Container>
    );
}
