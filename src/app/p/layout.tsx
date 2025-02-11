// app/layout.tsx
import LocalTokenMake from "./components/LocalTokenMake";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
            <LocalTokenMake>
                {children}
            </LocalTokenMake>
    );
}
