"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/products", label: "Products", icon: "📦" },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden bg-slate-900 text-white flex items-center justify-between px-4 py-3">
        <span className="font-bold">📦 Inventory System</span>
        <button onClick={() => setOpen(!open)} className="text-2xl">
          ☰
        </button>
      </div>

      <aside
        className={`${
          open ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 md:sticky md:top-0 md:h-screen bg-slate-900 text-white p-4`}
      >
        <div className="hidden md:flex items-center gap-3 mb-8 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-lg">
            📦
          </div>
          <span className="text-lg font-bold">Inventory</span>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 pt-4 mt-4 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}