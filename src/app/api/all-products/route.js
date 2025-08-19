import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category"); // query param থেকে category নেয়া

    const allProductsCollection = await dbConnect("all-products");

    let products;
    if (category) {
      // category filter থাকলে
      products = await allProductsCollection.find({ category }).toArray();
    } else {
      // সব products
      products = await allProductsCollection.find({}).toArray();
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
