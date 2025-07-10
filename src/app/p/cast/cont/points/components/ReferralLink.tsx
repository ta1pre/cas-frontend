"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default function ReferralLink() {
    const [invitationId, setInvitationId] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [referralUrl, setReferralUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInvitationId() {
            try {
                setLoading(true);
                console.log("📡 /api/v1/user/profile からinvitation_idを取得中...");
                
                const response = await fetchAPI('/api/v1/user/profile', {}, 'POST');
                
                if (response && response.invitation_id) {
                    const actualInvitationId = response.invitation_id;
                    setInvitationId(actualInvitationId);
                    
                    // 紹介URLを生成
                    const baseUrl = window.location.origin;
                    setReferralUrl(`${baseUrl}/auth/login?tr=${actualInvitationId}`);
                    
                    console.log("✅ invitation_id取得成功:", actualInvitationId);
                } else {
                    console.error("🚨 invitation_idが取得できませんでした");
                }
            } catch (error) {
                console.error("🚨 invitation_id取得エラー:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchInvitationId();
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("コピーに失敗しました:", error);
        }
    };

    if (loading) {
        return (
            <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-3">紹介リンク</h2>
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    if (!invitationId) {
        return (
            <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-3">紹介リンク</h2>
                <p className="text-red-500">紹介リンクの生成に失敗しました</p>
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-3">紹介リンク</h2>
            
            <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                    このリンクから新規登録してもらうと、紹介ポイントが獲得できます
                </p>
                
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={referralUrl}
                        readOnly
                        className="flex-1 p-2 border rounded bg-white text-sm"
                        onClick={(e) => e.currentTarget.select()}
                    />
                    <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded text-white transition-colors ${
                            copied 
                                ? "bg-green-600 hover:bg-green-700" 
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {copied ? "コピーしました！" : "コピー"}
                    </button>
                </div>
            </div>

            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                    <strong>紹介ポイントの仕組み</strong>
                </p>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• 新規登録時に仮ポイントが付与されます</li>
                    <li>• 紹介された方が初回出勤すると確定ポイントになります</li>
                </ul>
            </div>
        </div>
    );
}