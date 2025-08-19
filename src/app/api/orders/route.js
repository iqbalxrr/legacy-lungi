import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get("mobile");

    const ordersCollection = await dbConnect("orders");

    let orders;

    if (mobile) {
      // 🔹 শুধু নির্দিষ্ট mobile এর অর্ডার আনা
      orders = await ordersCollection.find({ mobile }).toArray();
    } else {
      // 🔹 সব অর্ডার আনা
      orders = await ordersCollection.find({}).toArray();
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
