

import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";


// ✅ GET => Get all products
export async function GET() {
  try {
    const collection = await dbConnect("all-products");
    const products = await collection.find({}).toArray();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ POST => Add a new product
export async function POST(req) {
  try {
    const body = await req.json();
    const collection = await dbConnect("all-products");

    const result = await collection.insertOne(body);

    return NextResponse.json(
      { message: "Product added", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
