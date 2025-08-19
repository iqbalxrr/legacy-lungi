
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const { orderId, mobile } = await req.json();

    if (!orderId || !mobile) {
      return NextResponse.json({ message: "Order ID and mobile required" }, { status: 400 });
    }

    const ordersCollection = await dbConnect("orders");

    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId), mobile });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "cancelled" } }
    );

    return NextResponse.json({ message: "Order cancelled successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
