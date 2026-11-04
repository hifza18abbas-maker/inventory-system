import ProductManager from "../ProductManager";

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Products</h1>
      <p className="text-gray-500 mt-1">
        Add, edit, search and manage your products.
      </p>
      <ProductManager />
    </div>
  );
}