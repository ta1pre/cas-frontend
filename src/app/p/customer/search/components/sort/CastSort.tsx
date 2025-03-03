// src/app/p/customer/search/components/sort/CastSort.tsx

interface CastFiltersProps {
    sort: string;
    setSort: (value: string) => void;
}

const CastFilters = ({ sort, setSort }: CastFiltersProps) => {
    return (
        <div>
            <label htmlFor="sort">並べ替え: </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                {[
                    { value: "recommended", label: "おすすめ順" },
                    { value: "age_asc", label: "年齢順（若い順）" },
                    { value: "age_desc", label: "年齢順（年上順）" },
                    { value: "fee_asc", label: "料金順（安い順）" },
                    { value: "fee_desc", label: "料金順（高い順）" },
                    { value: "rating_desc", label: "評価順" },
                    { value: "popularity_desc", label: "人気順" },
                    { value: "available_soon", label: "今すぐOK" },
                ].map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CastFilters;  // ✅ `export default CastFilters;` にする
