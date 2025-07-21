// src/app/miniapp/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

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
  const [selectedRole, setSelectedRole] = useState<'cast' | 'user' | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationLoading, setRegistrationLoading] = useState(false)

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

  const registerUser = async (userType: 'cast' | 'customer') => {
    try {
      setRegistrationLoading(true)
      
      let idToken = 'mock_token_for_development'
      
      // LIFF環境の場合はIDトークンを取得
      if (window.liff && window.liff.isLoggedIn()) {
        try {
          idToken = window.liff.getIDToken()
        } catch (error) {
          console.warn('LIFF IDトークン取得失敗、開発用トークンを使用:', error)
        }
      } else {
        console.log('LIFF未初期化またはログイン未完了、開発用トークンを使用')
      }
      
      // APIエンドポイント（環境に応じて変更）
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // 統一されたAPI呼び出し（ローカル・本番共通）
      const response = await fetch(`${apiUrl}/api/v1/miniapp/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: idToken,
          user_type: userType,
          tracking_id: referralCode || null
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('User registration successful:', result)
        setIsRegistered(true)
        return true
      } else {
        console.error('User registration failed:', result.message)
        return false
      }
    } catch (error) {
      console.error('Error during user registration:', error)
      return false
    } finally {
      setRegistrationLoading(false)
    }
  }

  const handleRoleSelection = async (role: 'cast' | 'user') => {
    setSelectedRole(role)
    
    // サービス種別選択時にユーザー登録
    const userType = role === 'cast' ? 'cast' : 'customer'
    const success = await registerUser(userType)
    
    if (!success) {
      // 登録失敗時はselectedRoleをリセット
      setSelectedRole(null)
      alert('登録に失敗しました。もう一度お試しください。')
    }
  }

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
        <div className="max-w-md mx-auto flex items-center justify-center">
          <h1 className="text-lg font-bold">PreCas 公式LINE</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 mt-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Welcome Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-6 text-center border-b">
            <div className="w-32 h-32 relative mx-auto mb-4">
              <Image
                src="/images/common/precas_logo2.jpg"
                alt="PreCas Logo"
                fill
                className="object-contain rounded-xl"
              />
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
                <p className="text-sm text-gray-800 leading-relaxed">
                  <span className="font-medium">{referralCode}さん</span>より紹介されました。
                  <br />
                  先行登録ボーナスが付与されます。
                </p>
              </div>
            )}

            {/* サービス種別選択 */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700 text-center">
                ご利用のサービスを選択してください
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelection('cast')}
                  disabled={registrationLoading}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left transform active:scale-95 ${
                    selectedRole === 'cast'
                      ? 'border-pink-400 bg-pink-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  } ${registrationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <p className="font-medium text-gray-800 mb-1">
                    キャスト（施術スタッフ）
                  </p>
                  <p className="text-xs text-gray-600">
                    対応エリアを登録し、アポの日程調整や売上・ポイントを管理できます。
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelection('user')}
                  disabled={registrationLoading}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left transform active:scale-95 ${
                    selectedRole === 'user'
                      ? 'border-[#00B900] bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  } ${registrationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <p className="font-medium text-gray-800 mb-1">
                    ご利用者
                  </p>
                  <p className="text-xs text-gray-600">
                    お好みのキャストを検索して予約できます。
                  </p>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {isFriend ? (
                <button
                  onClick={handleOpenChat}
                  disabled={!selectedRole}
                  className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
                    selectedRole
                      ? 'bg-[#00B900] text-white hover:bg-[#00A000] shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={{ minHeight: '52px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z" fill="currentColor"/>
                  </svg>
                  公式LINEを開く
                </button>
              ) : (
                <button
                  onClick={handleAddFriend}
                  disabled={!selectedRole}
                  className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
                    selectedRole
                      ? 'bg-[#00B900] text-white hover:bg-[#00A000] shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={{ minHeight: '52px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
                  </svg>
                  公式LINEを友だち追加
                </button>
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