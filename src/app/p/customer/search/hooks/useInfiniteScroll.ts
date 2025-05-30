// src/app/p/customer/search/hooks/useInfiniteScroll.ts
import { useEffect, Dispatch, SetStateAction } from "react";

/**
 * 無限スクロール用のカスタムフック
 */
export function useInfiniteScroll(
    loading: boolean,
    setOffset: Dispatch<SetStateAction<number>>,
    limit: number,
    hasMore: boolean
) {
    useEffect(() => {
        if (!hasMore || loading) return;

        let timer: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            if (loading) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollY + windowHeight >= documentHeight * 0.8) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    setOffset((prev) => (prev !== null ? prev + limit : 0));
                }, 300);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            if (timer) clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading, hasMore]);
}
