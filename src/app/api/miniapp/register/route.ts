// src/app/api/miniapp/register/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lineUserId, displayName, pictureUrl, referralCode } = body

    // FastAPIバックエンドに転送
    const response = await fetch('http://localhost:8000/api/miniapp/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line_user_id: lineUserId,
        display_name: displayName,
        picture_url: pictureUrl,
        referral_code: referralCode
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || '登録に失敗しました' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { detail: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}