import { MongoClient } from "mongodb";

export async function PATCH(req: Request) {
  const { event, userID } = await req.json();

  // Check if the request body is missing
  if (!event || !userID) {
    return new Response("Missing PROPS in the request body", {
      status: 500,
    });
  }
  if (!event.title || !event.days) {
    return new Response("Missing PROPS in the events", {
      status: 500,
    });
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGO_URI!
    );
    const db = client.db("seelect_main");

    // Update the values in the array
    const user = await db
      .collection("users")
      .updateOne({ id: userID }, { $push: { events: event } });
    if (!user) {
      return new Response("Usuario não encontrado", {
        status: 404,
      });
    }

    // Close the MongoDB connection
    await client.close();

    return new Response("Evento inserido", {
      status: 200,
    });
  } catch (error) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
