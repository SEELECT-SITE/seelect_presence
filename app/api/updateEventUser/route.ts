import { MongoClient } from "mongodb";

export async function PATCH(req: Request) {
  const { eventID, daysUpdate, userID } = await req.json();

  // Check if the request body is missing
  if (!eventID || !daysUpdate || !userID) {
    console.log({ eventID, daysUpdate, userID });
    return new Response("Missing eventID or daysUpdate in the request body", {
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
    const user = await db.collection("users").findOne({ id: userID });
    if (!user) {
      return new Response("Usuario não encontrado", {
        status: 404,
      });
    }
    //[EventId-1] is because if you send 0 the body donts recognize as a number.
    const eventToUpdate = user.events[eventID - 1];
    if (!eventToUpdate) {
      return new Response("Evento não encontrado", {
        status: 404,
      });
    }

    if (daysUpdate.length != eventToUpdate.days.length) {
      return new Response("Bad Request", {
        status: 400,
      });
    }

    eventToUpdate.days = daysUpdate;
    await db
      .collection("users")
      .updateOne({ id: userID }, { $set: { events: user.events } });
    // Close the MongoDB connection
    await client.close();

    return new Response("Evento atualizado", {
      status: 200,
    });
  } catch (error) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
