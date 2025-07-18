// src/app/miniapp/page.tsx
'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    liff: any
  }
}

export default function MiniAppPage() {
  const [referralCode, setReferralCode] = useState('')
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const initLiff = async () => {
      try {
        // LIFF SDKを動的に読み込み
        const liffScript = document.createElement('script')
        liffScript.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js'
        liffScript.onload = async () => {
          // LIFF初期化
          await window.liff.init({ liffId: '2007769669-j3NJ9Z2n' })
          setIsLiffReady(true)
          
          // ログイン確認
          if (window.liff.isLoggedIn()) {
            const profile = await window.liff.getProfile()
            setUserName(profile.displayName)
          }
        }
        document.body.appendChild(liffScript)
      } catch (error) {
        console.error('LIFF初期化エラー:', error)
      }
    }

    initLiff()
  }, [])

  return (
    <div className="container max-w-md mx-auto p-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-700">
            PreCas 公式LINE
          </h1>
          <p className="text-gray-600 mt-2">
            紹介コードを入力して、公式LINEに登録しよう！
          </p>
          {userName && (
            <p className="text-sm text-gray-500 mt-2">
              こんにちは、{userName}さん
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
              紹介コード
            </label>
            <input
              id="referralCode"
              type="text"
              placeholder="紹介コードを入力"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              maxLength={10}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => alert('登録機能は準備中です')}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              登録する
            </button>

            <button
              onClick={() => alert('友だち追加機能は準備中です')}
              className="w-full border border-emerald-600 text-emerald-600 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              公式LINEを友だち追加
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            登録することで、PreCasからのお知らせを
            <br />
            LINEで受け取ることができます
          </p>
        </div>
      </div>
    </div>
  )
}