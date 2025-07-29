#!/usr/bin/env python3
# /Users/taichiumeki/project/next/frontapp/test_rich_menu.py

import sys
import os
sys.path.append('/Users/taichiumeki/project/sandbox')

print("=== リッチメニュー機能テスト ===")

# 1. 依存関係チェック
print("\n1. 依存関係チェック:")
try:
    from PIL import Image, ImageDraw, ImageFont
    print('✓ Pillowライブラリが利用可能です')
except ImportError as e:
    print(f'✗ Pillowライブラリのインポートに失敗: {e}')
    exit(1)

# 2. フォント可用性チェック
print("\n2. フォント可用性チェック:")
font_paths = [
    '/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc',
    '/System/Library/Fonts/Hiragino Sans GB.ttc', 
    '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc',
    '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
    '/System/Library/Fonts/PingFang.ttc'
]

available_fonts = []
for font_path in font_paths:
    if os.path.exists(font_path):
        available_fonts.append(font_path)
        print(f'✓ {font_path}')
    else:
        print(f'✗ {font_path} (見つかりません)')

print(f'利用可能なフォント: {len(available_fonts)}個')

# 3. モジュールインポートテスト
print("\n3. モジュールインポートテスト:")
try:
    from app.features.linebot.rich_menu.menu_designer import MenuDesigner
    from app.features.linebot.rich_menu.menu_config import MENU_CONFIGURATIONS
    print('✓ モジュールのインポートに成功しました')
    
    # 設定の確認
    print(f'✓ 利用可能なメニュータイプ: {list(MENU_CONFIGURATIONS.keys())}')
    
except Exception as e:
    print(f'✗ モジュールのインポートに失敗: {str(e)}')
    import traceback
    traceback.print_exc()
    exit(1)

# 4. 画像生成テスト
print("\n4. 画像生成テスト:")
try:
    designer = MenuDesigner()
    print('✓ MenuDesignerインスタンスの作成に成功しました')
    
    # 各メニュータイプの画像生成テスト
    for menu_type in MENU_CONFIGURATIONS.keys():
        try:
            img = designer.create_menu_image(menu_type)
            print(f'✓ {menu_type}: 画像生成成功 (サイズ: {img.size})')
        except Exception as e:
            print(f'✗ {menu_type}: 画像生成失敗 - {str(e)}')
    
except Exception as e:
    print(f'✗ 画像生成テストでエラー: {str(e)}')
    import traceback
    traceback.print_exc()

# 5. 画像保存テスト
print("\n5. 画像保存テスト:")
try:
    output_dir = "/tmp/rich_menu_images"
    os.makedirs(output_dir, exist_ok=True)
    
    designer.save_menu_images()
    print('✓ 画像保存処理が完了しました')
    
    # 保存された画像ファイルの確認
    if os.path.exists(output_dir):
        files = [f for f in os.listdir(output_dir) if f.endswith('.png')]
        print(f'✓ 保存された画像ファイル: {len(files)}個')
        for filename in files:
            filepath = os.path.join(output_dir, filename)
            file_size = os.path.getsize(filepath)
            print(f'  - {filename}: {file_size:,} bytes')
    else:
        print('✗ 出力ディレクトリが見つかりません')
        
except Exception as e:
    print(f'✗ 画像保存テストでエラー: {str(e)}')
    import traceback
    traceback.print_exc()

print("\n=== テスト完了 ===")