
import ProductCard from "./ProductCard";
import dbConnect from "@/lib/dbConnect";

export const revalidate = 10;

const PremiumCollections = async () => {
  const collection = await dbConnect("all-products");

  const data = await collection.find({ category: "Premium Collections" }).toArray();

  // MongoDB ObjectId → string
  const safeData = data?.map(item => ({
    ...item,
    _id: item._id.toString(),
  }));



  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold mb-6">Premium Collections</h2>
      <div className="grid grid-320 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {safeData?.map(item => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default PremiumCollections;
