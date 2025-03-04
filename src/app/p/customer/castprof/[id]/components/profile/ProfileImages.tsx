// src/app/p/customer/castprof/[id]/components/profile/ProfileImages.tsx
import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";

interface ProfileImagesProps {
    images: { url: string; order_index: number }[];
}

export default function ProfileImages({ images }: ProfileImagesProps) {
    const [error, setError] = useState(false);

    // メイン画像 (order_index === 0) or 最初の画像
    const mainImage = useMemo(() => {
        if (images.length === 0) return "/default-avatar.png";
        const firstImage = images.find(img => img.order_index === 0) || images[0];
        return firstImage.url;
    }, [images]);

    // サムネイル画像 (order_index > 0)
    const thumbnails = useMemo(() => images.filter(img => img.order_index > 0), [images]);

    return (
        <Box className="p-4">
            {/* メイン画像 */}
            <img
                src={error ? "/default-avatar.png" : mainImage}
                alt="メイン画像"
                className="w-full h-auto object-cover rounded"
                onError={() => setError(true)}
            />

            {/* サムネイルリスト */}
            {thumbnails.length > 0 && (
                <Box className="flex gap-2 mt-2">
                    {thumbnails.map((image) => (
                        <img
                            key={image.order_index}
                            src={image.url}
                            alt="サムネイル画像"
                            className="w-16 h-16 object-cover rounded cursor-pointer"
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
