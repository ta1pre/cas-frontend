// テナント新規作成ページ
import TenantCreateForm from "./components/makeshop/TenantCreateForm";

export default function TenantPage() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-pink-500">テナント新規作成</h2>
      <TenantCreateForm />
    </div>
  );
}
