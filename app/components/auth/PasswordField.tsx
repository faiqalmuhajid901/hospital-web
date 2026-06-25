"use client";

import { useState } from "react";

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
};

export function PasswordField({
  id,
  label,
  placeholder = "Masukkan password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-[#dce8f6] bg-white px-4 pr-24 text-sm text-slate-800 outline-none transition focus:border-[#156eea] focus:ring-4 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-[#156eea] hover:bg-blue-50"
        >
          {visible ? "Tutup" : "Lihat"}
        </button>
      </div>
    </label>
  );
}