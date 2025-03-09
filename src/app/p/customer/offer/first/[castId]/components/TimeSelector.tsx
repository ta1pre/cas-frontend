"use client";

import { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ja from "date-fns/locale/ja";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import CheckIcon from "@mui/icons-material/Check";

interface TimeSelectorProps {
  onTimeChange?: (option: "fast" | "custom", date: Date | null, time: string | null) => void;
}

export default function TimeSelector({ onTimeChange }: TimeSelectorProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<Date | null>(null);
  const [confirmedTime, setConfirmedTime] = useState<string | null>(null);

  // 「最速案内」が選ばれているかどうか
  const isFastestSelected = !confirmedDate; 

  // 親に選択状況を通知するコールバック
  useEffect(() => {
    if (!onTimeChange) return;
    if (confirmedDate && confirmedTime) {
      // 日時指定が確定されたら "custom"
      onTimeChange("custom", confirmedDate, confirmedTime);
    } else {
      // 最速案内の場合は "fast"
      onTimeChange("fast", null, null);
    }
  }, [confirmedDate, confirmedTime, onTimeChange]);

  const handleFastClick = () => {
    setConfirmedDate(null); // 「最速案内」を選択
    setConfirmedTime(null);
  };

  const handleConfirm = () => {
    // 「確定」クリック時にモーダルを閉じる
    // 既に useEffect で confirmedDate/confirmedTime の変化を検知して親に通知
    if (selectedDate && selectedTime) {
      setConfirmedDate(selectedDate);
      setConfirmedTime(selectedTime);
    }
    setOpen(false);
  };

  return (
    <Box className="w-full bg-white rounded-lg shadow">
      <Box
        className="px-4 py-2 rounded-t-lg"
        sx={{ backgroundColor: "#fce7f3", borderBottom: "2px solid #ec4899" }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ec4899" }}>
          利用日時
        </Typography>
      </Box>

      <Box className="p-4">
        {/* 最速案内ボタン */}
        <Button
          fullWidth
          sx={{
            py: 2,
            my: 1,
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: isFastestSelected ? "#ec4899" : "#e5e7eb",
            color: isFastestSelected ? "#fff" : "#696969",
            "&:hover": {
              backgroundColor: isFastestSelected ? "#db2777" : "#d1d5db",
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={handleFastClick}
        >
          <span>最速案内</span>
          {isFastestSelected && <CheckIcon />}
        </Button>

        <p className="text-sm text-gray-600 mt-2">
          最速案内を選択の場合、キャストから最も早い到着時間をお知らせします。
        </p>

        {/* 希望日時を指定 */}
        <p
          className={`mt-4 text-sm font-semibold cursor-pointer flex items-center gap-2 ${
            confirmedDate ? "text-[#ec4899]" : "text-gray-500"
          }`}
          onClick={() => setOpen(true)}
        >
          {confirmedDate ? (
            <>
              希望日時：
              <span className="font-bold bg-[#ec4899] text-white px-2 py-1 rounded-lg flex items-center gap-1">
                {format(confirmedDate, "yyyy/MM/dd")} {confirmedTime || "未選択"}
                <CheckIcon fontSize="small" className="text-white" />
              </span>
            </>
          ) : (
            "希望日時を指定する"
          )}
        </p>

        {/* モーダル */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>希望時間を選択</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
              <DatePicker
                label="日付を選択"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                format="yyyy年MM月dd日"
                views={["year", "month", "day"]}
                minDate={startOfMonth(today)}
                maxDate={endOfMonth(addMonths(today, 1))}
                slotProps={{
                  toolbar: { hidden: true },
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                  },
                  calendarHeader: {
                    format: "yyyy年M月",
                  },
                }}
              />
            </LocalizationProvider>

            {/* 時間選択 */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"].map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "contained" : "outlined"}
                  sx={{
                    backgroundColor: selectedTime === time ? "#ec4899" : "transparent",
                    color: selectedTime === time ? "#fff" : "#696969",
                    "&:hover": {
                      backgroundColor: selectedTime === time ? "#db2777" : "#E5E7EB",
                    },
                    border: "1px solid #D1D5DB",
                  }}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>

            {/* 確定ボタン */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleConfirm}
                variant="contained"
                sx={{ backgroundColor: "#ec4899", "&:hover": { backgroundColor: "#db2777" } }}
                disabled={!selectedTime}
              >
                確定
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
