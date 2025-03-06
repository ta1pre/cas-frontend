// src/app/components/Header.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">My App</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-gray-700 rounded">
          ☰
        </button>
      </div>
      {isOpen && (
        <nav className="mt-2 bg-gray-700 p-2 rounded">
          <ul>
            <li>
              <Link href="/p/customer/search" className="block py-1">ダッシュボード</Link>
            </li>
            <li>
              <Link href="/p/customer/points" className="block py-1">ポイント管理</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}