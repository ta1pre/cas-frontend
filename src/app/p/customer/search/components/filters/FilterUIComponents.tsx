// src/app/p/customer/search/components/search_options/filters/FilterUIComponents.tsx

import React from "react";
import RangeFilter from "./RangeFilter";
import DropdownFilter from "./DropdownFilter";
import CheckboxFilter from "./CheckboxFilter";
import { PREFECTURE_OPTIONS } from "../../config/prefectures"; // ✅ インポート


// ✅ 配列に変換（`value` を `string` に統一し、`key` の重複を防ぐ）
const PREFECTURE_OPTIONS_ARRAY = Object.entries(PREFECTURE_OPTIONS).map(([label, value]) => ({
    label,  
    value: String(value) // ✅ `value` を `string` に変換
}));

/** 各フィルターの UI コンポーネントを登録 */
export const FilterUIComponents: Record<string, React.FC<any>> = {
    age: (props) => <RangeFilter {...props} min={18} max={60} step={1} />,
    height: (props) => <RangeFilter {...props} min={140} max={190} step={1} />,
    reservation_fee: (props) => <RangeFilter {...props} min={1000} max={50000} step={500} />,
    available_soon: (props) => <CheckboxFilter {...props} label="今すぐOK" />,
    location: (props) => <DropdownFilter {...props} options={PREFECTURE_OPTIONS_ARRAY} /> // ✅ 修正
};
