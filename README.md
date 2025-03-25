This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## ブランチ戦略

このプロジェクトでは以下のブランチ戦略を採用しています：

### メインブランチ

- `main`: 本番環境用のブランチ。常に安定した状態を維持します。
- `develop`: 開発用統合ブランチ。新機能の統合とテストを行います。

### 作業ブランチ

- `feature/機能名`: 新機能開発用のブランチ。`develop`から分岐し、完了後`develop`にマージします。
- `bugfix/バグ名`: バグ修正用のブランチ。
- `release/バージョン`: リリース準備用のブランチ。

### 開発フロー

1. `develop`ブランチから機能ブランチを作成
2. 機能開発とコミット
3. プルリクエストを作成して`develop`にマージ
4. テスト後、`main`ブランチにマージしてリリース

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
