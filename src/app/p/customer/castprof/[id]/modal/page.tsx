"use client";

import { useState } from "react";
import { Button, Container } from "@mui/material";
import CastProfileModal from "./CastProfileModal";

export default function CastProfilePage() {
    const [isOpen, setIsOpen] = useState(false);
    const castId = 181; // ✅ 仮で「181」を渡す

    return (
        <Container>
            <Button variant="contained" onClick={() => setIsOpen(true)}>
                プロフィールを開く (castId: 181)
            </Button>

            <CastProfileModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                castId={castId} // ✅ `castId=181` を渡す
            />
        </Container>
    );
}
