import { useEffect, Dispatch, SetStateAction } from "react";

/**
 * 無限スクロール用のカスタムフック
 */
export function useInfiniteScroll(
    loading: boolean,
    setOffset: Dispatch<SetStateAction<number>>, // ✅ `null` を含まない
    limit: number,
    hasMore: boolean
) {
    useEffect(() => {
        if (!hasMore && !loading) return; // ✅ データがないときも `setOffset()` をリセットできるように修正

        let timer: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            if (loading) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollY + windowHeight >= documentHeight * 0.8) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    setOffset((prev) => (prev !== null ? prev + limit : 0)); // ✅ `null` の場合は `0`
                }, 300);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            if (timer) clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading]); // ✅ `hasMore` を依存から外し、スクロール処理を止めない
}
