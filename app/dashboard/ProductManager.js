"use client";

import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;
const emptyForm = { name: "", category: "", price: "", quantity: "", image: "" };

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "all" || p.category === categoryFilter)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      image: p.image || "",
    });
    setEditingId(p._id);
    setError("");
    setShowForm(true);
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 300;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setForm((f) => ({ ...f, image: canvas.toDataURL("image/jpeg", 0.7) }));
        setError("");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setShowForm(false);
    await loadProducts();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await loadProducts();
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={inputClass}
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={openAdd}
          className="bg-indigo-600 text-white rounded-lg px-5 py-3 font-semibold hover:bg-indigo-700 whitespace-nowrap"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Quantity</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              paged.map((p) => (
                <tr key={p._id} className="border-t border-gray-100">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          📦
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{p.category}</td>
                  <td className="p-4 text-gray-600">Rs {p.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={
                        p.quantity < 5
                          ? "bg-red-100 text-red-700 px-2 py-1 rounded-full"
                          : "bg-green-100 text-green-700 px-2 py-1 rounded-full"
                      }
                    >
                      {p.quantity}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          Showing {paged.length} of {filtered.length} products
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage(safePage - 1)}
            disabled={safePage <= 1}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "Edit product" : "Add product"}
            </h3>
            {error && (
              <p className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                {error}
              </p>
            )}
            <form onSubmit={handleSave} className="space-y-3">
              <input
                name="name"
                placeholder="Product name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="category"
                placeholder="Category (e.g. Electronics)"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                className={inputClass}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full text-sm text-gray-600"
                />
                {form.image && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="text-sm text-red-600 font-semibold hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full border border-gray-300 text-gray-700 rounded-lg p-3 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white rounded-lg p-3 font-semibold hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}