

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId ) {
      return NextResponse.json({ message: "Order ID  required" }, { status: 400 });
    }

    const ordersCollection = await dbConnect("orders");

    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "approved" } }
    );

    return NextResponse.json({ message: "Order approved successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
