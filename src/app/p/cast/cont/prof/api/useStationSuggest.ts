import { useState, useEffect, useCallback } from 'react';
// lodashu306eu30a4u30f3u30ddu30fcu30c8u3092u6b63u3057u304fu884cu3046
import debounce from 'lodash/debounce';
import { fetchStationSuggest, Station } from './useFetchStation';

/**
 * u99c5u540du30b5u30b8u30a7u30b9u30c8u6a5fu80fdu7528u30abu30b9u30bfu30e0u30d5u30c3u30af
 * @param initialQuery u521du671fu691cu7d22u30cfu30a8u30eau30ea
 * @returns u691cu7d22u95a2u9023u30b9u30c6u30fcu30c8u3068u95a2u6570
 */
export const useStationSuggest = (initialQuery: string = '') => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  // u691cu7d22u5b9fu884cu95a2u6570
  const searchStations = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setStations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchStationSuggest(searchQuery);
      setStations(result);
      setOpen(result.length > 0);
    } catch (err) {
      console.error('u99c5u540du691cu7d22u4e2du306bu30a8u30e9u30fcu304cu767au751fu3057u307eu3057u305f:', err);
      setError('u99c5u540du306eu53d6u5f97u306bu5931u6557u3057u307eu3057u305f');
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // u30c7u30d0u30a6u30f3u30b9u51e6u7406u3092u9069u7528u3057u305fu691cu7d22u5b9fu884cu95a2u6570
  const debouncedSearchStations = useCallback(
    debounce((searchQuery: string) => {
      searchStations(searchQuery);
    }, 300),
    [searchStations]
  );

  // u5165u529bu5024u304cu5909u66f4u3055u308cu305fu3068u304du306eu30cfu30f3u30c9u30e9
  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      debouncedSearchStations(value);
    } else {
      setStations([]);
      setOpen(false);
    }
  };

  // u30b5u30b8u30a7u30b9u30c8u9805u76eeu304cu9078u629eu3055u308cu305fu3068u304du306eu30cfu30f3u30c9u30e9
  const handleSelectStation = (station: Station) => {
    setQuery(station.name);
    setOpen(false);
    return station;
  };

  // u521du671fu691cu7d22u30cfu30a8u30eau304cu3042u308bu5834u5408u306fu5b9fu884c
  useEffect(() => {
    if (initialQuery) {
      // 初期値がある場合はクエリを設定するが、サジェストは開かない
      setQuery(initialQuery);
      if (initialQuery.trim()) {
        // サジェストは表示せずに駅データだけ取得
        searchStations(initialQuery);
      }
    }
  }, [initialQuery, searchStations]);

  return {
    query,
    stations,
    loading,
    error,
    open,
    setOpen,
    handleInputChange,
    handleSelectStation,
  };
};
