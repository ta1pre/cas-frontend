import React from "react";
import RangeFilter from "./RangeFilter";
import DropdownFilter from "./DropdownFilter";
import CheckboxFilter from "./CheckboxFilter";
import { PREFECTURE_OPTIONS } from "../../config/prefectures"; // ✅ インポート

// ✅ 配列に変換（`value` を `string` に統一）
const PREFECTURE_OPTIONS_ARRAY = Object.entries(PREFECTURE_OPTIONS).map(([label, value]) => ({
    label,
    value: String(value)
}));

/** 各フィルターの UI コンポーネントを登録 */
export const FilterUIComponents: Record<string, { component: React.FC<any>; label: string }> = {
    age: { component: (props) => <RangeFilter {...props} min={18} max={30} step={1} unit="歳" />, label: "年齢" },
    height: { component: (props) => <RangeFilter {...props} min={140} max={190} step={5} unit="cm" />, label: "身長" },
    reservation_fee: { component: (props) => <RangeFilter {...props} min={1000} max={50000} step={2000} unit="円" />, label: "料金" },
    available_soon: { component: (props) => <CheckboxFilter {...props} label="今からOKのキャストに絞り込む" />, label: "今からOK！" },
    location: { component: (props) => <DropdownFilter {...props} options={PREFECTURE_OPTIONS_ARRAY} />, label: "エリア" }
};
