import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, mobile, address, shipping, total, payment, items } = body;

    // Basic validation
    if (!name || !mobile || !address || !shipping || !items || items.length === 0) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Filter invalid items
    const orderItems = items
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size || null,
      }));

    if (orderItems.length === 0) {
      return NextResponse.json({ message: "No valid items to order" }, { status: 400 });
    }

    const ordersCollection = await dbConnect("orders");

    // Prevent duplicate order in 1 minute
    const lastOrder = await ordersCollection.findOne(
      { mobile },
      { sort: { createdAt: -1 } }
    );

    const sameItems = (items1, items2) =>
      items1.length === items2.length &&
      items1.every((item, idx) =>
        item.productId === items2[idx].productId &&
        item.quantity === items2[idx].quantity
      );

    if (lastOrder && sameItems(lastOrder.items, orderItems) && (new Date() - lastOrder.createdAt) < 60000) {
      return NextResponse.json({ message: "You already ordered the same items recently" }, { status: 400 });
    }

    const newOrder = {
      name,
      mobile,
      address,
      shipping,
      total,
      payment,
      items: orderItems,
      status: "pending",
      createdAt: new Date(),
    };

    await ordersCollection.insertOne(newOrder);

    return NextResponse.json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
