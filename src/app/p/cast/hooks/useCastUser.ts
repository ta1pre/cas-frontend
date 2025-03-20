// 📂 src/app/p/cast/hooks/useCastUser.ts
"use client";

import { useContext } from "react";
import { CastUserContext } from "@/app/p/cast/layout";
import { DecodedToken } from "@/hooks/useUser";

export const useCastUser = (): DecodedToken => {
  const user = useContext(CastUserContext);
  if (!user) {
    throw new Error("CastUserContextが未設定です");
  }
  return user;
};
