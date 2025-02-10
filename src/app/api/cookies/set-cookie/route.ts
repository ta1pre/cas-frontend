import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        console.log("🚀 [API] `Set-Cookie` エンドポイントにリクエスト受信");

        const { newToken, expiration } = await req.json();
        if (!newToken || !expiration) {
            console.error("❌ `local_token` または `expiration` の値がありません");
            return NextResponse.json({ message: 'Missing token or expiration' }, { status: 400 });
        }

        console.log("📡 `local_token` を上書き:", newToken);
        console.log("⏳ 設定する有効期限:", expiration);

        // 🔹 現在の時間を取得
        const now = Math.floor(Date.now() / 1000);
        const maxAge = expiration - now; // `Max-Age` は秒単位

        if (maxAge <= 0) {
            console.error("⛔ `expiration` がすでに過去の時間です");
            return NextResponse.json({ message: 'Invalid expiration time' }, { status: 400 });
        }

        console.log(`✅ "local_token" の "Max-Age" 設定: ${maxAge} 秒`);

        const response = NextResponse.json({ message: 'local_token updated successfully' });

        response.headers.append(
            'Set-Cookie',
            `local_token=${newToken}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${maxAge}`
        );

        console.log("✅ `local_token` の `Set-Cookie` 上書き成功");
        return response;
    } catch (error) {
        console.error("❌ [API] `Set-Cookie` 実行エラー:", error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: String(error) },
            { status: 500 }
        );
    }
}
