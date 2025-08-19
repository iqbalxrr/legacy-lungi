
import bcrypt from "bcryptjs";


async function hashPassword(plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, 10); 
  return hashed;
}

// ব্যবহার:
hashPassword("admin123").then(console.log);
