import dbConnect from "@/lib/dbConnect";


export async function GET(req) {
  try {
    const adminsCollection = await dbConnect("admins");
    const admin = await adminsCollection.findOne({}); // fetch first admin

    console.log("Fetched admin data:", admin);

    if (!admin) {
      return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ email: admin.email, password: admin.password }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch admin data" }), { status: 500 });
  }
}
