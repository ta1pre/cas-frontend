"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import NearestStationList from "./NearestStationList";
import StationSuggestSelector from "./StationSuggestSelector";

interface Props {
  onStationRegister: () => void;
}

export default function NearestStationSelection({ onStationRegister }: Props) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box className="bg-white rounded-lg">
      {/* ✅ タブ UI */}
      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        <Tab label="GPSで検索" />
        <Tab label="駅名で検索" />
      </Tabs>

      {/* ✅ タブの内容を表示（選択された方のみ） */}
      <Box className="mt-4">
        {tabValue === 0 && <NearestStationList onStationRegister={onStationRegister} />}
        {tabValue === 1 && <StationSuggestSelector onStationSelect={onStationRegister} />}
      </Box>
    </Box>
  );
}
