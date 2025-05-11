export type Cast = {
  id: number;
  name: string;
  tenant: number;
  support_area?: string; // サポートエリア用のプロパティを追加
  station_name?: string; // 最寄り駅名用プロパティを追加
};
