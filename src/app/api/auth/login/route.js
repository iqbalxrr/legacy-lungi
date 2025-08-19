
import dbConnect from "@/lib/dbConnect";


// export const runtime = "node"; 

export async function POST(req) {
  const { email } = await req.json();

  // MongoDB collection access
  const adminCollection = await dbConnect("admins");

  // Find admin by email
  const admin = await adminCollection.findOne({ email });
  if (!admin) {
    return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
  }

  // Compare password
//   const isPassCorrect = await bcrypt.compare(password, admin.password);
//   if (!isPassCorrect) {
//     return new Response(JSON.stringify({ error: "Incorrect password" }), { status: 400 });
//   }

  return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
}
