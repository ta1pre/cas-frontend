"use client";

import { useEffect, useState } from "react";
import { fetchCustomerReserve } from "./api/reserve";

export default function ReservePage() {
    const [message, setMessage] = useState<string>("ロード中...");

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchCustomerReserve();
            if (response && response.message) {
                setMessage(response.message);
            } else {
                setMessage("データ取得に失敗しました。");
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">予約ページ</h1>
            <p className="mt-4">{message}</p>
        </div>
    );
}
