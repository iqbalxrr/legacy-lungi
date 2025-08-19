
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    // Optional: connection pool size, timeout
    maxPoolSize: 10, // প্রয়োজনমতো পরিবর্তন করতে পারো
  });
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function dbConnect(collectionName) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection(collectionName);
}



// import { MongoClient, ServerApiVersion } from 'mongodb';

//  export default function dbConnect( collectionName){
//     const uri = process.env.MONGODB_URL;
//     const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// return client.db(process.env.DB_NAME).collection(collectionName);

// }
