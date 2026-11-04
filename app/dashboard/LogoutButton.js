"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-slate-600 transition"
    >
      Logout
    </button>
  );
}