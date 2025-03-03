"use client";

import BasicTraits from "../components/BasicTraits";

export default function TraitsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">特徴一覧（POST /list）</h1>
      <BasicTraits />
    </div>
  );
}
