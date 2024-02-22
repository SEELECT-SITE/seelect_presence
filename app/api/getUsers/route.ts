import { MongoClient } from "mongodb";

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGO_URI!
    );
    const db = client.db("test");

    // Get all users from the MongoDB collection
    const users = await db.collection("users").find().toArray();

    // Close the MongoDB connection
    await client.close();

    return Response.json(users);
  } catch (error) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
