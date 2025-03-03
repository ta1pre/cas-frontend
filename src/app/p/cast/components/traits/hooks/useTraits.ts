import { useEffect, useState } from "react";
import { getAllTraits, getSelectedTraits, registerTraits, deleteTraits } from "../api/traits";
import useUser from "@/hooks/useUser";

export const useTraits = () => {
  const user = useUser();
  const castId = user?.user_id ?? null;
  const [traitsByCategory, setTraitsByCategory] = useState<Record<string, { id: number; name: string; weight: number; category: string; is_active: number }[]>>({});
  const [selectedTraits, setSelectedTraits] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.token && castId !== null) {
      fetchTraitsList(user.token);
      fetchSelectedTraits(user.token, castId);
    }
  }, [user?.token, castId]);

  const fetchTraitsList = async (token: string) => {
    try {
      const data = await getAllTraits(token);
      setTraitsByCategory(data);
    } catch (err) {
      console.error("特徴リストの取得に失敗しました", err);
      setError("特徴リストを取得できませんでした");
    }
  };

  const fetchSelectedTraits = async (token: string, castId: number) => {
    try {
      const selected = await getSelectedTraits(token, castId);
      setSelectedTraits(selected);
    } catch (err) {
      console.error("選択済みの特徴取得に失敗しました", err);
      setError("選択済みの特徴を取得できませんでした");
    }
  };

  const toggleTrait = async (traitId: number) => {
    if (!user?.token || !castId) return;

    const isSelected = selectedTraits.includes(traitId);
    const newSelectedTraits = isSelected
      ? selectedTraits.filter(id => id !== traitId)
      : [...selectedTraits, traitId];

    setSelectedTraits(newSelectedTraits);

    if (isSelected) {
      await deleteTraits(user.token, castId, [traitId]);
    } else {
      await registerTraits(user.token, castId, [traitId]);
    }
  };

  return {
    traitsByCategory,
    selectedTraits,
    error,
    toggleTrait,
  };
};
