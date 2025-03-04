// src/app/p/customer/castprof/[id]/components/common/ErrorMessage.tsx
import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface ErrorMessageProps {
    message?: string;  // ✅ `message` をオプショナルに
    missingId?: boolean;  // ✅ `missingId` を追加
}

export default function ErrorMessage({ message, missingId }: ErrorMessageProps) {
    const router = useRouter();

    const errorMessage = missingId ? "キャストIDが無効です" : message;

    return (
        <Container 
            maxWidth="sm"
            sx={{ 
                minHeight: "100vh", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                ⚠️ {errorMessage}
            </Typography>

            {/* ✅ 検索ページへ戻るボタン */}
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => router.push("/p/customer/search")}
            >
                🔍 検索ページへ戻る
            </Button>
        </Container>
    );
}
