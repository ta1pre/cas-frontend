export type Cast = {
  id: number;
  name: string;
  tenant: number;
  support_area?: string; // サポートエリア用のプロパティを追加
  station_name?: string; // 最寄り駅名用プロパティを追加
  
  // プロファイルフィールド追加
  age?: number;
  height?: number;
  bust?: number;
  waist?: number;
  hip?: number;
  cup?: string;
  birthplace?: string;
  blood_type?: string;
  hobby?: string;
  self_introduction?: string;
  job?: string;
  dispatch_prefecture?: string;
  reservation_fee_deli?: number;
  is_active?: number;
};
