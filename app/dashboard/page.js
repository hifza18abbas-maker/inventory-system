import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUser } from "@/lib/auth";

const colors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
];

export default async function OverviewPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  await connectDB();
  const products = await Product.find({ user: user.id })
    .sort({ updatedAt: -1 })
    .lean();

  const totalUnits = products.reduce((s, p) => s + p.quantity, 0);
  const stockValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
  const lowStock = products.filter((p) => p.quantity < 5);

  const byCategory = {};
  products.forEach((p) => {
    byCategory[p.category] = (byCategory[p.category] || 0) + p.quantity;
  });
  const chart = Object.entries(byCategory)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);
  const maxQty = Math.max(1, ...chart.map((c) => c.qty));

  const cards = [
    { label: "Total Products", value: products.length, icon: "📦" },
    { label: "Total Units in Stock", value: totalUnits, icon: "🧮" },
    { label: "Low Stock Items", value: lowStock.length, icon: "⚠️" },
    { label: "Stock Value", value: `Rs ${stockValue.toLocaleString()}`, icon: "💰" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user.name}!
      </h1>
      <p className="text-gray-500 mt-1">Here is an overview of your inventory.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="text-2xl">{c.icon}</div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Stock by Category</h2>
          {chart.length === 0 ? (
            <p className="text-sm text-gray-500">
              No data yet.{" "}
              <Link href="/dashboard/products" className="text-indigo-600 font-semibold">
                Add your first product
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {chart.map((c, i) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <span className="text-gray-500">{c.qty} units</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[i % colors.length]}`}
                      style={{ width: `${(c.qty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Low Stock Alerts</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-500">All items are well stocked. ✅</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <li key={String(p._id)} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {p.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mt-4">
        <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <li
                key={String(p._id)}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">
                  Updated <b className="text-gray-900">{p.name}</b> ({p.quantity} in stock)
                </span>
                <span className="text-gray-400">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}