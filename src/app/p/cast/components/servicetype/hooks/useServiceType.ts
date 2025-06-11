import { useEffect, useState } from "react";
import { useSetupStorage } from "@/app/p/setup/hooks/storage/useSetupStorage";
import { getAllServiceTypes, getSelectedServiceTypes, registerServiceTypes, deleteServiceTypes } from "../api/servicetype";
import useUser from "@/hooks/useUser";

/**
 * ✅ サービスタイプのデータ型
 */
interface ServiceType {
  id: number;
  name: string;
  weight: number;
  category: string;
  is_active: number;
  description: string | null; // ✅ `description` を追加
}

/**
 * ✅ カテゴリごとのサービスタイプリスト型
 */
type ServiceTypesByCategory = Record<string, ServiceType[]>;

export const useServiceType = () => {
  const user = useUser();
  const { getStorage } = useSetupStorage();
  const storedCastId = typeof window !== "undefined" ? getStorage("cast_id") : null;
  const castId = storedCastId ? Number(storedCastId) : user?.user_id ?? null;
  const [serviceTypesByCategory, setServiceTypesByCategory] = useState<ServiceTypesByCategory>({});
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.token && castId !== null) {
      fetchServiceTypes(user.token);
      fetchSelectedServiceTypes(user.token, castId);
    }
  }, [user?.token, castId]);

  const fetchServiceTypes = async (token: string) => {
    try {
      const data = await getAllServiceTypes(token);
      setServiceTypesByCategory(data);
    } catch (err) {
      console.error("サービスリストの取得に失敗しました", err);
      setError("サービスリストを取得できませんでした");
    }
  };

  const fetchSelectedServiceTypes = async (token: string, castId: number) => {
    try {
      const selected = await getSelectedServiceTypes(token, castId);
      setSelectedServiceTypes(selected);
    } catch (err) {
      console.error("選択済みのサービス取得に失敗しました", err);
      setError("選択済みのサービスを取得できませんでした");
    }
  };

  const toggleServiceType = async (serviceTypeId: number) => {
    if (!user?.token || !castId) return;

    const isSelected = selectedServiceTypes.includes(serviceTypeId);
    const newSelectedServiceTypes = isSelected
      ? selectedServiceTypes.filter(id => id !== serviceTypeId)
      : [...selectedServiceTypes, serviceTypeId];

    setSelectedServiceTypes(newSelectedServiceTypes);

    if (isSelected) {
      await deleteServiceTypes(user.token, castId, [serviceTypeId]);
    } else {
      await registerServiceTypes(user.token, castId, [serviceTypeId]);
    }
  };

  return {
    serviceTypesByCategory,
    selectedServiceTypes,
    error,
    toggleServiceType,
  };
};
