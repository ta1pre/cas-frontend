import { useState, useEffect, useRef, useCallback } from "react";
import GetExistingMedia from "./GetExistingMedia";

const useMediaStatus = (targetType: string, targetId: number | null, orderIndexes: number[], uploadTrigger: number) => {
  const [mediaStatus, setMediaStatus] = useState<{ [key: number]: boolean }>({});
  const hasFetched = useRef(false);

  const fetchMediaStatus = useCallback(async () => {
    if (targetId === null) {
      setMediaStatus({});
      return;
    }

    const status: { [key: number]: boolean } = {};
    for (const index of orderIndexes) {
      const existingMedia = await GetExistingMedia(targetType, targetId, index);
      status[index] = existingMedia.length > 0;
    }
    setMediaStatus(status);
  }, [targetType, targetId]);

  useEffect(() => {
    hasFetched.current = false; // ✅ `uploadTrigger` が更新されたら強制的に再取得
    fetchMediaStatus();
  }, [fetchMediaStatus, uploadTrigger]); // ✅ `uploadTrigger` を追加して即時更新

  return mediaStatus;
};

export default useMediaStatus;
