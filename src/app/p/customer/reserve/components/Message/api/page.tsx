"use client";

import { useState } from "react";
import fetchMessages from "./messages_get";
import sendMessage from "./messages_send";

export default function MessagesTestPage() {
    const reservationId = 12; // ✅ 仮の予約ID（テスト用）
    const [getResponse, setGetResponse] = useState<string | null>(null);
    const [sendResponse, setSendResponse] = useState<string | null>(null);

    const handleFetchMessages = async () => {
        const data = await fetchMessages(reservationId);
        setGetResponse(data ? JSON.stringify(data) : "エラー発生");
    };

    const handleSendMessage = async () => {
        const data = await sendMessage(reservationId, "テストメッセージ");
        setSendResponse(data ? JSON.stringify(data) : "エラー発生");
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">メッセージAPIテスト</h1>

            <button className="p-2 bg-blue-500 text-white rounded mb-2" onClick={handleFetchMessages}>
                メッセージ取得APIをテスト
            </button>
            {getResponse && <p className="mt-2 text-sm bg-gray-200 p-2 rounded">レスポンス: {getResponse}</p>}

            <button className="p-2 bg-green-500 text-white rounded mt-4" onClick={handleSendMessage}>
                メッセージ送信APIをテスト
            </button>
            {sendResponse && <p className="mt-2 text-sm bg-gray-200 p-2 rounded">レスポンス: {sendResponse}</p>}
        </div>
    );
}
