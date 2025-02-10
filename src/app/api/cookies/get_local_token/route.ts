import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';  // ✅ Next.js の headers API を使用

export async function GET() {
    try {
        console.log("🚀 [API] `get_local_token` エンドポイントにリクエスト受信");

        // ✅ `cookies()` を `await` で明示的に取得
        const cookieStore = await cookies();  // 🔹 `await` を追加して型エラーを防ぐ
        const localToken = (await cookieStore).get('local_token')?.value;  // ✅ `await` を追加

        if (!localToken) {
            console.error("❌ `local_token` が見つかりません");
            return NextResponse.json({ message: 'No local_token found' }, { status: 401 });
        }

        console.log("✅ `local_token` を取得:", localToken);
        return NextResponse.json({ local_token: localToken });
    } catch (error) {
        console.error("❌ `get_local_token` API 実行エラー:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: String(error) }, { status: 500 });
    }
}
