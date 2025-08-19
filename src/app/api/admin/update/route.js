import dbConnect from "@/lib/dbConnect";

export async function PUT(req) {
  try {
    const updates = await req.json();
    const adminsCollection = await dbConnect("admins");

    const result = await adminsCollection.findOneAndUpdate(
      {}, 
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(
      JSON.stringify({ message: "Admin updated successfully", admin: result.value }),
      { status: 200, headers: { "Content-Type": "application/json" } } // <-- important!
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to update admin" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
