import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);
    // SSGビルド時にはログを出力しない
    if (typeof window !== 'undefined') {
        console.log("✅ useAuth() 実行:", { user: context?.user?.userId, loading: context?.loading }); // ✅ `context` の中身を確認
    }

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
