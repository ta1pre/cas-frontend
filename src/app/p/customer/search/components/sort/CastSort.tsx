import { Select, MenuItem, FormControl, Typography } from "@mui/material";

interface CastSortProps {
    sort: string;
    setSort: (value: string) => void;
    prefectureName: string | null;
}

const CastSort = ({ sort, setSort, prefectureName }: CastSortProps) => {
    return (
        <div className="flex justify-between items-center my-2"> {/* ✅ 左にエリア、右にソートを配置 */}
            {/* ✅ 都道府県名を左側に表示 */}
            <Typography variant="body2" color="textSecondary">
                {prefectureName ? `エリア: ${prefectureName}` : "エリア: 未設定"}
            </Typography>

            {/* ✅ 右側にソートフィルターを配置 */}
            <FormControl className="w-34">
                <Select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    displayEmpty
                    className="bg-white border border-gray-300 rounded-md px-2 text-gray-700 shadow-sm text-sm h-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    sx={{ minHeight: "32px", fontSize: "0.875rem", padding: "4px 8px" }} // ✅ 高さ & フォントサイズ調整
                >
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
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default CastSort;
