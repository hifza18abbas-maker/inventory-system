import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default async function DashboardLayout({ children }) {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar user={{ name: user.name, role: user.role }} />
      <main className="flex-1 min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}