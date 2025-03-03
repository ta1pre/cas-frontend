import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);
    console.log("✅ useAuth() で取得した context:", context); // ✅ `context` の中身を確認

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
