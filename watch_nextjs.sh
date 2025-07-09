#!/bin/bash

# ログファイルをプロジェクト外に配置して無限ループを防止
LOG_DIR="/tmp/nextjs_logs"
LOG_FILE="$LOG_DIR/nextjs.log"
# 古いログファイルを削除し、ディレクトリがなければ作成
mkdir -p "$LOG_DIR"
rm -f "$LOG_FILE"

echo "📝 Next.jsのログ監視を開始します..."
echo "💡 ヒント: Claude Codeで 'claude \"nextjs.logのエラーを修正して\"' と入力すると自動修正できます"
echo "⚠️  注意: 既にNext.jsが起動している場合は、そのプロセスを終了してから実行してください"
echo ""

# ポート3000の使用状況を確認
if lsof -i :3000 >/dev/null 2>&1; then
    echo "❌ ポート3000は既に使用中です"
    echo "💡 既存のNext.jsプロセスを終了してから再実行してください"
    echo "   または、既存のプロセスのログを確認したい場合は、そのターミナルでCtrl+Cで終了後に実行してください"
    exit 1
fi

# npm run dev の出力をファイルに保存しながら表示
# ループ開始ごとにディレクトリ存在チェック
npm run dev 2>&1 | while IFS= read -r line; do
    mkdir -p "$LOG_DIR"
    # 画面に表示
    echo "$line"
    
    # ファイルに追加
    echo "$line" >> "$LOG_FILE"
    
    # 300行を超えたら古い行を削除
    if [ $(wc -l < "$LOG_FILE" 2>/dev/null || echo 0) -gt 300 ]; then
        tail -n 100 "$LOG_FILE" > "${LOG_FILE}.tmp"
        mv "${LOG_FILE}.tmp" "$LOG_FILE"
    fi
done