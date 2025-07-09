"use client";

import { useState } from "react";
import fetchChangeStatus from "./api/fetchChangeStatus";

export default function ChangeStatusPage() {
    const [message, setMessage] = useState<string | null>(null);

    const handleChangeStatus = async () => {
        const response = await fetchChangeStatus("adjusting", 1, user?.userId || 0);

        if (response) {
            setMessage(response.message);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-lg font-bold mb-4">ステータス変更テスト</h1>
            <button
                onClick={handleChangeStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                ステータスを「adjusting」に変更
            </button>

            {message && <p className="mt-4 text-green-600">✅ {message}</p>}
        </div>
    );
}
