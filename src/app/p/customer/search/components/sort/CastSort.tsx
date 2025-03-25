import { Select, MenuItem, FormControl } from "@mui/material";
import React from 'react';
import ServiceType from './service_type';
import AreaButton from './area_button';
import { CAST_TYPE_OPTIONS } from '../filters/FilterUIComponents';

interface CastSortProps {
  sort: string;
  setSort: (value: string) => void;
  prefectureName: string | null;
}

const CastSort = ({ sort, setSort, prefectureName }: CastSortProps) => {
  return (
    <div className="flex justify-between items-center my-2">
      {/* サービスタイプ */}
      <div className="flex items-center mr-auto whitespace-nowrap">
        {/* サービスタイプボタンを一時的に非表示（display: none）にする */}
        <div style={{ display: 'none' }}>
          <ServiceType castTypeOptions={CAST_TYPE_OPTIONS} />
        </div>

        {/* エリア */}
        <div className="ml-4">
          <AreaButton prefectureName={prefectureName} />
        </div>
      </div>

      {/* 並び替え */}
      <FormControl className="w-34">
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          displayEmpty
          className="bg-white border border-gray-300 rounded-md px-2 text-gray-700 shadow-sm text-sm h-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          sx={{ minHeight: "32px", fontSize: "0.875rem", padding: "4px 8px", marginLeft: "10px" }}
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
