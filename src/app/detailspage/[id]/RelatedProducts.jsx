"use client";
import Link from "next/link";
import { TbCurrencyTaka } from "react-icons/tb";

export default function RelatedProducts({ products }) {

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="text-center rounded shadow hover:shadow-lg transition-transform duration-300 hover:scale-[1.02]"
          >
            <Link href={`/detailspage/${product._id}`}>
              {/* Image with zoom effect on hover */}
              <div className="w-full h-48 overflow-hidden rounded-t group">
                <img
                  src={product?.image}
                  alt={product?.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Title with yellow hover effect */}
              <h3 className="mt-2 font-semibold transition-colors duration-200 hover:text-yellow-500">
                {product.name}
              </h3>

              <p className="text-yellow-600 font-bold"> <TbCurrencyTaka size={20} /> {product.price}</p>
            

            {/* Button */}
            <div className="px-4 pt-2 pb-4">
              <button

                    className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                >
                    View details
                </button>
            </div>
            </Link>

          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/all-products" className="text-blue-500 hover:underline">
          View All Products
        </Link>
      </div>
    </div>
  );
}
