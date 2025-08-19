
"use client";

import { useState, useEffect } from "react";
import ProductCard from "../collections/ProductCard";
import Spinner from "@/components/Spinner";

export default function AllProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch products from API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Query param দিয়ে API call
            let url = `/api/all-products`;
            if (category) {
                url += `?category=${category}`;
            }
            const res = await fetch(url);
            const data = await res.json();

            // search filter on client side
            const filteredData = data.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase())
            );

            setProducts(filteredData);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    // Fetch products when category or search changes
    useEffect(() => {
        fetchProducts();
    }, [category, search]);

    return (
        <div className="py-24 md:py-10 px-6 min-h-[70vh]  max-w-6xl mx-auto  ">
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded-md w-full md:w-1/3"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 rounded-md"
                >
                    <option value="">All Categories</option>
                    <option value="Premium Collections">Premium Collections</option>
                    <option value="Popular Collections">Popular Collections</option>
                    <option value="Discount Collections">Discount Collections</option>
                </select>
            </div>

            {/* Products Grid */}
            {loading ? (
                <Spinner/>
            ) : (
                <div className="grid grid-320 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(item => (
                        <ProductCard key={item._id} product={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
