

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setPrice(data.price);
      });
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, price }),
      headers: { "Content-Type": "application/json" },
    });
    toast.success("✅ Product updated!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    router.push("/dashboard/products");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleEdit} className="space-y-2">
        <input className="border p-2 w-full" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 w-full" value={price} onChange={e => setPrice(e.target.value)} />
        <button className="bg-green-500 text-white px-4 py-2" type="submit">Update Product</button>
      </form>
    </div>
  );
}
