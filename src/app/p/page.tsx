"use client";
import Link from 'next/link';
import { useEffect } from "react";

export default function DashboardPage() {
    useEffect(() => {
    
    }, []);

    return (
        <div>
            <h1>ダッシュボード</h1>
            <h3>📌 他のページへ移動</h3>
            <ul>
                <li><Link href="/p/cast">キャストのページ</Link></li>
                <li>↑タップ</li>
            </ul>
        </div>
    );
}
