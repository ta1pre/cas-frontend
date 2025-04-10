import React from "react";
import RangeFilter from "./RangeFilter";
import DropdownFilter from "./DropdownFilter";
import CheckboxFilter from "./CheckboxFilter";
import { PREFECTURE_OPTIONS } from "../../config/prefectures"; // 

// 年齢オプション
const AGE_OPTIONS = [
    { label: "指定なし", value: "" },
    { label: "18～20歳", value: "18-20" },
    { label: "21～23歳", value: "21-23" },
    { label: "24～26歳", value: "24-26" },
    { label: "27歳～", value: "27-" },
];

// 身長オプション
const HEIGHT_OPTIONS = [
    { label: "指定なし", value: "" },
    { label: "～150cm", value: "-150" },
    { label: "151～155cm", value: "151-155" },
    { label: "156～160cm", value: "156-160" },
    { label: "161～165cm", value: "161-165" },
    { label: "166cm～", value: "166-" },
];

// 料金オプション (顧客支払いポイント基準, 5000P刻み)
const FEE_OPTIONS = [
    { label: "指定なし", value: "" },
    { label: "～4,999P", value: "-4999" },         // 
    { label: "5,000～9,999P", value: "5000-9999" },   // 
    { label: "10,000～14,999P", value: "10000-14999" }, // 
    { label: "15,000～19,999P", value: "15000-19999" }, // 
    { label: "20,000P～", value: "20000-" },        // 
];

// キャストタイプのオプションを定義
export const CAST_TYPE_OPTIONS = [
    { label: "Cas", value: "A" },
    { label: "Deli Cas", value: "B" },
    { label: "どちらも", value: "AB" }
];

// 配列に変換（`value` を `string` に統一）
const PREFECTURE_OPTIONS_ARRAY = Object.entries(PREFECTURE_OPTIONS).map(([label, value]) => ({
    label,
    value: String(value)
}));

/** 各フィルターの UI コンポーネントを登録 */
export const FilterUIComponents: Record<string, { component: React.FC<any>; label: string }> = {
    age: { component: (props) => <DropdownFilter {...props} options={AGE_OPTIONS} />, label: "年齢" },          // RangeFilter から DropdownFilter に変更
    height: { component: (props) => <DropdownFilter {...props} options={HEIGHT_OPTIONS} />, label: "身長" },       // RangeFilter から DropdownFilter に変更
    reservation_fee: { component: (props) => <DropdownFilter {...props} options={FEE_OPTIONS} />, label: "料金 (P)" }, // RangeFilter から DropdownFilter に変更
    available_soon: { component: (props) => <CheckboxFilter {...props} label="今からOKのキャストに絞り込む" />, label: "今からOK！" },
    location: { component: (props) => <DropdownFilter {...props} options={PREFECTURE_OPTIONS_ARRAY} />, label: "エリア" },
    // cast_type フィルターを追加 キャストタイプ復活はここで。
    // cast_type: { component: (props) => <DropdownFilter {...props} options={CAST_TYPE_OPTIONS} />, label: "キャストタイプ" }
};
