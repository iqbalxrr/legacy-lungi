import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// ✅ Get single product
export async function GET(req, { params }) {
  try {
    const { id } = params; 

    const productsCollection = await dbConnect("all-products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ Update product
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  // Exclude _id from body before updating
  const { _id, ...updateData } = body;

  try {
    const productsCollection = await dbConnect("all-products");
    const updated = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );
    return new Response(JSON.stringify(updated.value), { status: 200 });
  } catch (err) {
    console.error("Error updating product:", err);
    return new Response(JSON.stringify({ error: "Failed to update product" }), { status: 500 });
  }
}

// ✅ Delete product
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const productsCollection = await dbConnect("all-products");
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
