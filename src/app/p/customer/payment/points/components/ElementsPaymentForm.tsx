"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../api/payment_intent";
import { useRouter } from "next/navigation";

// 環境変数から公開キーを取得
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  points: number;
  clientSecret: string;
  onSuccess?: () => void;
}

/**
 * 決済フォーム本体
 */
function PaymentForm({ amount, points, clientSecret, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripe || !elements) {
      setError("Stripeの初期化に失敗しました。");
      setLoading(false);
      return;
    }
    try {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        setError("カード情報の入力欄が見つかりません。");
        setLoading(false);
        return;
      }
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });
      if (result.error) {
        setError(result.error.message || "決済に失敗しました");
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error("決済処理中にエラー:", err);
      setError("決済処理中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full px-2 sm:px-0 bg-white rounded-lg shadow" style={{ boxShadow: 'none' }}>
      <div className="min-w-[350px] max-w-xs w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Linkバナー＆説明 */}
          <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-2 flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#0A2540"/><path d="M8.2 12.1l2.2 2.2 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-blue-900 text-sm font-semibold">「Link」かんたん決済に対応しています</span>
          </div>
          <div className="text-xs text-gray-500 mb-2">カード番号欄に「Link」ボタンが表示されている場合、メール認証だけで即決済できます（カード入力不要）。</div>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">カード番号</label>
              <CardNumberElement
                options={{ showIcon: true }}
                className="w-full py-2 px-2 text-base bg-gray-50 border border-gray-200 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">有効期限</label>
              <CardExpiryElement className="w-full py-2 px-2 text-base bg-gray-50 border border-gray-200 rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <CardCvcElement className="w-full py-2 px-2 text-base bg-gray-50 border border-gray-200 rounded" />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-green-900 text-white font-bold hover:bg-green-800 transition"
            style={{ letterSpacing: '0.08em' }}
          >
            {loading
              ? "決済中..."
              : "購入する"}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Stripe Elements Provider付きラッパー（clientSecret取得＆Link対応）
 */
export default function ElementsPaymentForm({ amount, points, onSuccess }: { amount: number; points: number; onSuccess?: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 毎回新しいPayment Intentを作成するために、マウント時に一度だけ実行
    const fetchClientSecret = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await createPaymentIntent(amount, points);
        if (!res || !res.client_secret) {
          setError("決済情報の作成に失敗しました。");
          setLoading(false);
          return;
        }
        console.log("✅ 新しいPayment Intent作成成功:", res.client_secret.substring(0, 20) + '...');
        setClientSecret(res.client_secret);
      } catch (e) {
        console.error("❌ Payment Intent作成エラー:", e);
        setError("決済情報の作成に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
    // amount, pointsが変わった時だけ再取得
  }, [amount, points]);

  if (loading) {
    return <div className="py-10 text-center text-gray-400">決済情報を準備中...</div>;
  }
  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }
  if (!clientSecret) {
    return <div className="py-10 text-center text-red-500">決済情報が取得できませんでした。</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ 
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#EC407A',
        }
      } 
    }}>
      <PaymentForm amount={amount} points={points} clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}
