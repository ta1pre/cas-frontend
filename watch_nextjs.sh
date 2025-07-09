#!/bin/bash

# 古いログファイルを削除
rm -f nextjs.log

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
npm run dev 2>&1 | while IFS= read -r line; do
    # 画面に表示
    echo "$line"
    
    # ファイルに追加
    echo "$line" >> nextjs.log
    
    # 300行を超えたら古い行を削除
    if [ $(wc -l < nextjs.log 2>/dev/null || echo 0) -gt 300 ]; then
        tail -n 300 nextjs.log > nextjs.log.tmp
        mv nextjs.log.tmp nextjs.log
    fi
done