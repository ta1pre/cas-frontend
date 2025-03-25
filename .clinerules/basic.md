# 【指示書】派遣エステ予約Webアプリ開発指示

## フロントエンドのルート
/Users/taichiumeki/project/next/frontapp/src
## バックエンドのルート
/Users/taichiumeki/project/sandbox/app

## ✅ プロジェクト概要
FAST API と Next.js (フロントエンド) を使用した、以下の機能を持つ **派遣エステ予約Webアプリ** を開発する。

---

## ✅ 技術構成
### バックエンド
- **FastAPI**
- **DB**: MySQL 

### フロントエンド
- **Next.js (React)**
- **MUI (Material UI)**
- **Tailwind CSS**

### 開発環境URL（ngrok経由）
| 種別 | URL |
|------|-----|
| API | https://a8166f23e4a5.ngrok.app → http://localhost:8000 |
| WEB | https://60c151628549.ngrok.app → http://localhost:3000 |

---
# バックエンド
.  # sandbox(Fast API)
├── alembic               # ✅ DBマイグレーション管理（Alembic）
│   ├── __pycache__       # Pythonキャッシュ
│   └── versions          # ✅ マイグレーション履歴
│       └── __pycache__
├── app                   # ✅ Pythonバックエンド（FastAPIメイン）
│   ├── __pycache__
│   ├── api               # ✅ APIエンドポイントまとめ（v1以下でバージョン管理）
│   │   └── v1
│   │       └── routers   # ✅ FastAPIのルーティング管理
│   ├── core              # ✅ 設定・認証・セキュリティ関連（config, auth など）
│   ├── data              # ✅ 外部データやjson格納（初期データ用）
│   ├── db                # ✅ DB接続・モデル（SQLAlchemy）
│   │   └── models        # ✅ テーブルごとのSQLAlchemyモデル
│   ├── features          # ✅ ドメインごとに機能をまとめたディレクトリ（重要）
│   │   ├── _駅の距離insertDistances   # 駅距離計算・登録関連
│   │   ├── account       # ✅ アカウント管理（ログイン/登録）
│   │   ├── admin         # 管理者系機能
│   │   ├── cast          # ✅ キャスト関連機能（特徴・サービス種別など）
│   │   ├── customer      # ✅ 顧客関連機能（検索・予約・エリア）
│   │   ├── linebot       # ✅ LINE BOT連携処理
│   │   ├── media         # ✅ 画像・メディア管理
│   │   ├── notifications # ✅ 通知処理（LINE通知など）
│   │   ├── points        # ✅ ポイント関連機能
│   │   ├── reserve       # ✅ 予約管理（ステータス・履歴・チャット含む）
│   │   ├── setup         # 初期設定・セットアップAPI
│   │   └── sms           # ✅ SMS送信機能（認証コードなど）
│   └── scripts           # ✅ バッチやデータ取得スクリプト類


機能フォルダの例(それぞれの機能ごとに分かれます)
│   │   ├── media                         # ✅ メディア管理（画像・動画・S3連携）
│   │   │   ├── endpoints                # ✅ メディア関連API（アップロード/取得/削除）
│   │   │   ├── repositories             # ✅ DB操作（media_files テーブルの操作層）
│   │   │   ├── schemas                  # ✅ リクエスト/レスポンス用スキーマ（pydantic）
│   │   │   └── services                 # ✅ S3操作や画像削除などのサービス層（ロジック）

# フロントエンド

.  # next/frontapp/ (Next.js フロントエンド)
├── app                     # ✅ メインアプリケーション領域（ページ・機能ごとに分割）
│   ├── account             # アカウント系機能（会員情報など）
│   ├── api                 # ✅ API通信系（axiosのラッパーなど）
│   │   ├── admin           # 管理画面用API
│   │   ├── auth            # 認証・ログイン系API
│   │   ├── referral        # 紹介機能API
│   │   ├── therapist       # セラピスト検索・管理API
│   │   └── user            # ユーザー系API
│   ├── auth                # ✅ 認証・認可（ログイン・コールバック）
│   ├── error               # エラーページ・エラーハンドリング
│   ├── p                   # ✅ ページごとの機能（p = pages の略）
│   │   ├── admin           # 管理者機能
│   │   │   ├── components  # 管理画面UI
│   │   │   └── points      # 管理者：ポイント管理
│   │   │       ├── api
│   │   │       ├── components
│   │   │       └── hooks
│   │   ├── cast            # ✅ キャスト関連機能
│   │   │   ├── components  # キャストUI（レイアウト・画像・サービス選択など）
│   │   │   │   ├── layout
│   │   │   │   ├── media   # メディアアップロード・表示
│   │   │   │   │   ├── common
│   │   │   │   │   └── sample
│   │   │   │   ├── servicetype  # サービスタイプ選択機能
│   │   │   │   └── traits       # キャスト特徴選択機能
│   │   │   ├── cont             # キャスト詳細（プロフィール・予約・ヘルプ）
│   │   │   ├── hooks            # キャスト用hooks
│   │   │   └── sandbox          # キャスト用サンドボックス・テスト
│   │   ├── components           # 共通コンポーネント
│   │   ├── customer             # ✅ カスタマー関連機能
│   │   │   ├── appinfo          # アプリ情報表示
│   │   │   ├── area             # エリア検索機能
│   │   │   ├── castprof         # キャストプロフィール詳細（[id]ごとに取得）
│   │   │   ├── components       # 顧客用共通UI
│   │   │   ├── favorites        # お気に入り管理
│   │   │   ├── help             # FAQ・ヘルプ画面
│   │   │   ├── offer            # ✅ 予約オファー機能
│   │   │   ├── points           # ポイント購入・履歴
│   │   │   ├── reserve          # ✅ 予約機能
│   │   │   │   ├── Message      # メッセージ機能
│   │   │   │   ├── ReservationDetail  # 予約詳細UI
│   │   │   │   ├── status       # ステータス表示UI
│   │   │   │   └── utils        # 予約関連ユーティリティ
│   │   │   └── search           # キャスト検索機能
│   │   ├── setup                # ✅ 初期設定フロー（登録・プロフィール）
│   │   └── store                # Reduxやzustandなど状態管理
│   └── s                       # サンプルやデバッグページ群
│       ├── help
│       └── sandbox
│           ├── ero             # 18禁系サンプル
│           ├── normal          # 通常サンプル
│           └── recruit         # 募集ページ系
├── components                 # ✅ グローバル共通コンポーネント
│   ├── Auth                   # 認証関連UI
│   ├── theme                  # MUIテーマ管理
│   └── ui                     # 汎用UIコンポーネント（Button, Card等）
├── context                    # ✅ グローバルステート管理（React Context）
│   ├── auth                   # 認証状態管理
│   └── setup                  # セットアップフロー管理
├── hooks                      # ✅ カスタムhooks
│   └── cookies                # Cookie管理用hook
├── middleware                 # Next.jsのミドルウェア
├── public                     # 静的ファイル・画像・アップロード先
│   ├── icons
│   └── uploads
├── services                   # ✅ 外部API・機能サービス呼び出し
│   ├── auth                   # 認証プロバイダ
│   └── setup                  # セットアップ用サービス
├── styles                     # ✅ グローバルCSS・Tailwind
├── types                      # ✅ 型定義（TypeScript用）
└── utils                      # ✅ 共通関数・ヘルパー

