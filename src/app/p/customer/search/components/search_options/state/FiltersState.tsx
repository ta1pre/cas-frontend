import { createContext, useContext, useState, useEffect } from "react";
import { PREFECTURE_OPTIONS } from "../../../config/prefectures";
import Cookies from 'js-cookie';

interface FiltersStateType {
    selectedFilters: Record<string, any>;
    appliedFilters: Record<string, any>;
    setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    applyFilters: () => void;
    updateFilter: (key: string, value: any) => void;
    directUpdateFilter: (key: string, value: any) => void; // 追加: ダイレクト更新用の関数
    resetFilters: () => void;
    hasActiveFilters: boolean;
    prefectureName: string | null;  // 都道府県名を追加
}

export const FiltersStateContext = createContext<FiltersStateType | null>(null);

// クッキーの値に基づいてcast_typeの初期値を決定する関数
const getInitialCastType = (): string => {
    const startPageCookie = Cookies.get('StartPage');
    
    if (startPageCookie) {
        const [type, genre] = startPageCookie.split(':');
        
        if (type === 'customer') {
            if (genre === 'cas') {
                return 'A'; // casの場合はAを初期値に
            } else if (genre === 'precas') {
                return 'B'; // precasの場合はBを初期値に
            }
        }
    }
    
    // クッキーがない場合やその他の場合はデフォルトでAを返す
    return 'A';
};

export function FiltersStateProvider({ children }: { children: React.ReactNode }) {
    // クッキーから初期値を取得
    const initialCastType = getInitialCastType();
    
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({ cast_type: initialCastType });
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({ cast_type: initialCastType });
    const [prefectureName, setPrefectureName] = useState<string | null>(null); // 都道府県名を管理

    // service_typeコンポーネント専用のダイレクト更新関数
    const directUpdateFilter = (key: string, value: any) => {
        const newFilters = { ...selectedFilters, [key]: value };
        
        if (key === "location") {
            const matchedName = Object.entries(PREFECTURE_OPTIONS).find(([name, id]) => id === Number(value));
            newFilters["prefectureName"] = matchedName ? matchedName[0] : "未設定";
            setPrefectureName(matchedName ? matchedName[0] : "未設定");
        }
        
        // selectedFiltersとappliedFiltersを同時に更新
        setSelectedFilters(newFilters);
        setAppliedFilters(newFilters);
    };

    const updateFilter = (key: string, value: any) => {
        setSelectedFilters((prev) => {
            const newFilters = { ...prev, [key]: value };

            if (key === "location") {
                const matchedName = Object.entries(PREFECTURE_OPTIONS).find(([name, id]) => id === Number(value));
                newFilters["prefectureName"] = matchedName ? matchedName[0] : "未設定";
                setPrefectureName(matchedName ? matchedName[0] : "未設定"); // `prefectureName` を更新
            }

            return newFilters;
        });
    };

    const applyFilters = () => {
        setAppliedFilters({ ...selectedFilters });
    };

    const resetFilters = () => {
        setSelectedFilters({});
        setPrefectureName(null); // フィルターリセット時に都道府県名もリセット
    };

    const hasActiveFilters = Object.keys(selectedFilters).length > 0;

    return (
        <FiltersStateContext.Provider
            value={{
                selectedFilters,
                appliedFilters,
                setSelectedFilters,
                applyFilters,
                updateFilter,
                directUpdateFilter, // 新しい関数を追加
                resetFilters,
                hasActiveFilters,
                prefectureName, // 追加
            }}
        >
            {children}
        </FiltersStateContext.Provider>
    );
}

export function useFiltersState() {
    const context = useContext(FiltersStateContext);
    if (!context) throw new Error("useFiltersState must be used within FiltersStateProvider");
    return context;
}
