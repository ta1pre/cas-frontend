"use client";

import { useEffect, useState } from "react";
import fetchReferredUsers, { ReferredUser } from "../api/getReferredUsers";

export default function ReferredUsersList() {
    const [users, setUsers] = useState<ReferredUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReferredUsers() {
            setLoading(true);
            const data = await fetchReferredUsers();
            if (data) {
                setUsers(data);
            }
            setLoading(false);
        }
        loadReferredUsers();
    }, []);

    function formatDate(isoString: string) {
        const date = new Date(isoString);
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }

    return (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">紹介したユーザー一覧</h2>
            
            {loading ? (
                <p className="mt-2 text-gray-500">読み込み中...</p>
            ) : users.length > 0 ? (
                <div className="mt-4">
                    <div className="grid grid-cols-1 gap-3">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {user.nick_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            LINE ID: {user.line_id}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(user.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                        合計: {users.length}人
                    </p>
                </div>
            ) : (
                <p className="mt-2 text-gray-500">
                    まだ紹介したユーザーはいません。
                </p>
            )}
        </div>
    );
}