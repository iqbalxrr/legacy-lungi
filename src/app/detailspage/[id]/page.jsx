import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import ProductDetails from "./ProductDetails";
import RelatedProducts from "./RelatedProducts";

export default async function ProductPage({ params }) {
  const { id } = params;
  const collection = await dbConnect("all-products");

  let query = {};

  // ✅ Only use ObjectId if it's valid
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) };
  } else {
    // Otherwise search by slug (if you store it in DB)
    query = { slug: id };
  }

  const productData = await collection.findOne(query);

  if (!productData) {
    return <div className="text-center py-10">Product not found</div>;
  }

  const relatedProducts = await collection
    .find({ category: productData.category, _id: { $ne: productData._id } })
    .limit(4)
    .toArray();

  const plainProductData = JSON.parse(JSON.stringify(productData));
  const plainRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <div className="py-10">
      <ProductDetails key={plainProductData._id} product={plainProductData} />

      <div className="mt-10">
        <h2 className="text-xl text-center font-bold mb-4">
          Related Products
        </h2>
        <RelatedProducts products={plainRelatedProducts} />
      </div>
    </div>
  );
}
