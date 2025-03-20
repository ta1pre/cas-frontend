// 📂 src/app/p/cast/cont/reserve/components/OptionPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchCastOptions } from "../api/useFetchCastOptions";
import { useCastUser } from "@/app/p/cast/hooks/useCastUser";

interface OptionPanelProps {
  reservationId: number;
}

export default function OptionPanel({ reservationId }: OptionPanelProps) {
  const user = useCastUser();
  const [availableOptions, setAvailableOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await fetchCastOptions(reservationId, user.user_id);
        setAvailableOptions(data.available_options);
        setSelectedOptions(data.selected_options);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, [reservationId, user.user_id]);

  if (loading) return <div>読み込み中...</div>;

  return (
    <div style={{ padding: "16px" }}>
      <h3>オプション一覧</h3>
      <div>
        {availableOptions.map((option) => (
          <div key={option.option_id} style={{ marginBottom: "8px" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions.some(
                  (selected) => selected.option_id === option.option_id
                )}
                readOnly
              />
              {option.option_name}（{option.option_price}円）
            </label>
          </div>
        ))}
      </div>

      <h4>自由入力オプション（既存）</h4>
      {selectedOptions
        .filter((opt) => opt.custom_option_name)
        .map((custom, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            {custom.custom_option_name}（{custom.custom_option_price}円）
          </div>
        ))}
    </div>
  );
}
