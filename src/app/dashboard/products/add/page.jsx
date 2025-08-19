"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Premium Collections");
  const [sizes, setSizes] = useState([""]);
  const [brand, setBrand] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleAddSize = () => setSizes([...sizes, ""]);
  const handleRemoveSize = (index) => setSizes(sizes.filter((_, i) => i !== index));
  const handleSizeChange = (index, value) => {
    const updated = [...sizes];
    updated[index] = value;
    setSizes(updated);
  };

  // ✅ handle image upload to imgbb
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImage(data.data.url); // hosted image URL
         toast.success("✅ Image uploaded successfully!")
      } else {
        toast.error("❌ Image upload failed!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("❌ Something went wrong during upload.");
    }
    setUploading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("❌ Please upload an image first!");

    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ name, image, category, sizes, brand, oldPrice, newPrice, description, discount }),
      headers: { "Content-Type": "application/json" },
    });

      toast.success("✅ Product added!", {
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
    <div className="min-h-screen py-20 md:py-2  sm:px-6 lg:px-8">
      <Card className="max-w-5xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">Add Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAdd} className="space-y-4">

            {/* Image Upload */}
            <div className="flex flex-col">
              <Label>Upload Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
              {image && (
                <img src={image} alt="preview" className="w-32 h-32 object-cover mt-2 rounded-md border" />
              )}
            </div>

            {/* Product Name */}
            <div className="flex flex-col">
              <Label>Product Name</Label>
              <Input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <Label>Category</Label>
              <select
                className="border rounded-md p-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Premium Collections</option>
                <option>Popular Collections</option>
                <option>Discount Collections</option>
              </select>
            </div>

            {/* Sizes */}
            <div className="flex flex-col">
              <Label>Sizes</Label>
              {sizes.map((size, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    placeholder="S, M, L, XL"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                  />
                  {sizes.length > 1 && (
                    <Button type="button" variant="destructive" onClick={() => handleRemoveSize(index)}>
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" className="mt-2" onClick={handleAddSize}>
                + Add Size
              </Button>
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <Label>Brand</Label>
              <Input placeholder="Brand Name" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Old Price</Label>
                <Input type="number" placeholder="Old Price" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <Label>New Price</Label>
                <Input type="number" placeholder="New Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <Label>Short Description</Label>
              <textarea
                className="border rounded-md p-2 w-full min-h-[80px]"
                placeholder="Short description about the product"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Discount */}
            <div className="flex flex-col">
              <Label>Discount %</Label>
              <Input type="number" placeholder="Discount %" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
