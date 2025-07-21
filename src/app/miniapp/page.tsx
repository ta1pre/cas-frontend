// src/app/miniapp/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    liff: any
  }
}

function MiniAppContent() {
  const searchParams = useSearchParams()
  const referralCode = searchParams?.get('ref') || ''
  
  const [userName, setUserName] = useState('')
  const [isFriend, setIsFriend] = useState(false)

  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffScript = document.createElement('script')
        liffScript.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js'
        liffScript.onload = async () => {
          await window.liff.init({ liffId: '2007769669-j3NJ9Z2n' })
          
          if (window.liff.isLoggedIn()) {
            const profile = await window.liff.getProfile()
            setUserName(profile.displayName)
            
            // 友だち登録状態を確認
            try {
              const friendship = await window.liff.getFriendship()
              setIsFriend(friendship.friendFlag)
            } catch (err) {
              console.log('友だち状態取得エラー:', err)
              // エラーの場合は友だち未登録として扱う
              setIsFriend(false)
            }
          }
        }
        document.body.appendChild(liffScript)
      } catch (error) {
        console.error('LIFF初期化エラー:', error)
      }
    }

    initLiff()
  }, [])


  const handleOpenChat = () => {
    if (window.liff && window.liff.isInClient()) {
      // LINEアプリ内から公式アカウントのトーク画面を開く
      window.liff.openWindow({
        url: 'https://line.me/R/oaMessage/@696unbpu/',
        external: false
      })
      // ミニアプリを閉じる
      setTimeout(() => {
        window.liff.closeWindow()
      }, 1000)
    } else {
      // 外部ブラウザの場合
      window.open('https://line.me/R/oaMessage/@696unbpu/', '_blank')
    }
  }

  const handleAddFriend = () => {
    if (window.liff && window.liff.isInClient()) {
      window.open('https://line.me/R/ti/p/@696unbpu')
    } else {
      window.open('https://line.me/R/ti/p/@696unbpu', '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#00B900] text-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.04 2 10.92c0 2.52 1.19 4.8 3.11 6.41.31.26.49.64.49 1.04 0 .19-.04.38-.11.55L4.5 21.5c-.11.32.03.67.33.83.1.05.21.08.32.08.21 0 .41-.09.55-.25l2.32-2.77c.36-.01.71-.03 1.06-.07 1.05.25 2.14.38 3.24.38 5.52 0 10-4.04 10-9.08C22 6.04 17.52 2 12 2z" fill="currentColor"/>
          </svg>
          <h1 className="text-lg font-bold">PreCas 公式LINE</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 mt-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Welcome Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-6 text-center border-b">
            <div className="w-20 h-20 bg-[#00B900] rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.04 2 10.92c0 2.52 1.19 4.8 3.11 6.41.31.26.49.64.49 1.04 0 .19-.04.38-.11.55L4.5 21.5c-.11.32.03.67.33.83.1.05.21.08.32.08.21 0 .41-.09.55-.25l2.32-2.77c.36-.01.71-.03 1.06-.07 1.05.25 2.14.38 3.24.38 5.52 0 10-4.04 10-9.08C22 6.04 17.52 2 12 2z" fill="white"/>
              </svg>
            </div>
            
            {userName ? (
              <div>
                <p className="text-sm text-gray-600 mb-1">こんにちは</p>
                <p className="text-lg font-bold text-[#2E3238]">{userName}さん</p>
              </div>
            ) : (
              <p className="text-lg font-bold text-[#2E3238]">PreCas 公式LINE</p>
            )}
            
            {isFriend ? (
              <p className="text-sm text-gray-600 mt-3">
                すでに友だち登録済みです
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-3">
                公式LINEに友だち登録しよう
              </p>
            )}
          </div>

          {/* Form Section */}
          <div className="p-6 space-y-6">
            {referralCode && (
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">紹介コード</p>
                <p className="text-xl font-bold text-[#2E3238]" style={{ letterSpacing: '0.1em' }}>
                  {referralCode}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {isFriend ? (
                <button
                  onClick={handleOpenChat}
                  className="w-full bg-[#00B900] text-white py-4 rounded-xl font-medium hover:bg-[#00A000] transition-all flex items-center justify-center gap-2"
                  style={{ minHeight: '52px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z" fill="currentColor"/>
                  </svg>
                  公式LINEを開く
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddFriend}
                    className="w-full bg-[#00B900] text-white py-4 rounded-xl font-medium hover:bg-[#00A000] transition-all flex items-center justify-center gap-2"
                    style={{ minHeight: '52px' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
                    </svg>
                    公式LINEを友だち追加
                  </button>

                </>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                {isFriend ? (
                  <>
                    PreCasからの最新情報や
                    <br />
                    お得なキャンペーン情報をお届けします
                  </>
                ) : (
                  <>
                    登録することで、PreCasからの最新情報や
                    <br />
                    お得なキャンペーン情報をLINEで受け取れます
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 PreCas. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  )
}

export default function MiniAppPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B900] mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <MiniAppContent />
    </Suspense>
  )
}