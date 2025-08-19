
import dbConnect from "@/lib/dbConnect";
import ProductCard from "./ProductCard";


export const revalidate = 10;

const PopularCollection = async () => {
  const collection = await dbConnect("all-products");
  
  const data = await collection.find({ category: "Popular Collections" }).toArray();

  // MongoDB ObjectId → string
  const safeData = data.map(item => ({
    ...item,
    _id: item._id.toString(),
  }));

  return (
    <div className="my-20">
      <h2 className="text-2xl font-bold mb-6">Popular Collections</h2>
      <div className="grid grid-320 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {safeData.map(item => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default PopularCollection;
