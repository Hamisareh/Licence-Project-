import React from "react";
import { Search } from "lucide-react";

export default function TopbarAdmin({ search, setSearch }) {
  return (
    <header className="bg-white shadow p-4 mx-8 mt-8 rounded-2xl flex items-center justify-between sticky top-0 z-10">
      <div className="relative max-w-md w-full">  </div>

      <div className="flex items-center gap-6">
        <div className="bg-secondary text-white rounded-full px-4 py-1 font-semibold select-none">
          Administrateur
        </div>
      </div>
    </header>
  );
}