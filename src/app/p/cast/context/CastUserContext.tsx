// ud83dudcc2 src/app/p/cast/context/CastUserContext.tsx
"use client";

import { createContext } from "react";
import { DecodedToken } from "@/hooks/useUser";

export const CastUserContext = createContext<DecodedToken | null>(null);
