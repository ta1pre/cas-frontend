"use client";

import { useEffect, useRef } from "react";
import useUser from "@/hooks/useUser";
import { createCastProfile } from "@/app/p/setup/api/castProfile";
import { useSetupStorage } from "@/app/p/setup/hooks/storage/useSetupStorage";

/**
 * キャストプロフィールを自動生成するカスタムフック
 * - user_type === "cast" かつ cast_common_prof が未登録の場合に1度だけ API を呼ぶ
 */
export const useCastProfile = () => {
  const user = useUser();
  const { getStorage, setStorage } = useSetupStorage();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    if (!user?.token || !user.user_id) return;

    const userType = getStorage("user_type");
    if (userType !== "cast") return;

    // 既に cast_id を保存済みなら何もしない
    const existing = getStorage("cast_id");
    if (existing) {
      called.current = true;
      return;
    }

    // プロフィール作成
    const create = async () => {
      try {
        await createCastProfile();
        setStorage("cast_id", String(user.user_id));
      } catch (e) {
        console.error("cast profile create failed", e);
      } finally {
        called.current = true;
      }
    };
    create();
  }, [user?.token]);
};
