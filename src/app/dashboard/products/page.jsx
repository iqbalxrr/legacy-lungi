"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p._id !== id));

    Swal.fire(
      'Deleted!',
      'Your product has been deleted.',
      'success'
    );
  }
};

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSave = async () => {
    try {
      const res = await fetch(`/api/products/${selectedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct),
      });
      if (res.ok) {
        setProducts(products.map(p => p._id === selectedProduct._id ? selectedProduct : p));
        setIsModalOpen(false);
      } else {
        toast.error("❌ Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating product.");
    
    }
  };

  return (
    <div className="py-16 md:py-2 px-4 md:px-8 lg:px-16">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">All Products</h1>

      {/* Table for large devices */}
      <div className="hidden lg:block">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Image</th>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Name</th>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Category</th>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Brand</th>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Sizes</th>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Price</th>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Discount</th>
              <th className="p-3 text-left text-gray-700 uppercase text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(p => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                <td className="p-3"><img src={p?.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl" /></td>
                <td className="p-3 font-medium text-gray-800">{p.name}</td>
                <td className="p-3 text-gray-700">{p?.category}</td>
                <td className="p-3 text-gray-700">{p?.brand}</td>
                <td className="p-3  text-gray-700">{p?.sizes?.join(", ")}</td>
                <td className="p-3 text-gray-700">
                  <span className="line-through text-gray-400 mr-1">${p?.oldPrice}</span>
                  <span className="font-semibold text-green-600">${p?.newPrice}</span>
                </td>
                <td className="p-3 text-red-600 font-semibold">{p.discount}%</td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile & medium devices */}
      <div className="lg:hidden grid gap-6">
        {products.map(p => (
          <div key={p._id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
            {p.img && <img src={p.img} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-3" />}
            <h2 className="font-bold text-xl mb-1 text-gray-800">{p.name}</h2>
            <p className="text-gray-600 mb-1">Category: {p.category}</p>
            <p className="text-gray-600 mb-1">Brand: {p.brand}</p>
            <p className="text-gray-600 mb-1">Sizes: {p.sizes?.join(", ")}</p>
            <p className="text-gray-600 mb-1">
              Price: <span className="line-through text-gray-400 mr-1">${p.oldPrice}</span>
              <span className="font-semibold text-green-600">${p.newPrice}</span>
            </p>
            <p className="text-red-600 font-semibold mb-2">Discount: {p.discount}%</p>
            <p className="text-gray-700 mb-3">{p.description}</p>
            <div className="flex gap-3">
              <button
                onClick={() => openEditModal(p)}
                className="bg-blue-600 hover:bg-blue-700 transition text-white w-1/2 py-2 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 hover:bg-red-700 transition text-white w-1/2 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-xl p-6 z-50 max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">Edit Product</h2>
            <input
              type="text"
              value={selectedProduct.name}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
              className="border p-3 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              value={selectedProduct.newPrice}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, newPrice: e.target.value })}
              className="border p-3 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
