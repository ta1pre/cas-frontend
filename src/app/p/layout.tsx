// app/layout.tsx
import LocalTokenMake from "./components/LocalTokenMake";
import { Container } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
            <LocalTokenMake>
                <Container
                    maxWidth="md" // ✅ 画面幅を制限（変更可能）
                    sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default", // ✅ テーマの背景色を適用
                    display: "flex",
                    flexDirection: "column",
                    }}
                >
                    {children}
                </Container>
            </LocalTokenMake>
    );
}
