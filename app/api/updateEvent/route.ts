import { MongoDBUser } from "../migrateUsers/route";
import { EventProps } from "@/types";
import { MongoClient } from "mongodb";

export async function PATCH(req: Request) {
  const { event } = await req.json();
  console.log(event.participants[0].days);

  // Check if the request body is missing
  if (!event) {
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
    const eventCollection = db.collection<EventProps>("events");

    // Update the values in the array
    const eventDoc = await eventCollection.updateOne(
      { title: event.title },
      { $set: { title: event.title, participants: event.participants } }
    );
    const usersCollection = db.collection<MongoDBUser>("users");
    for (const user of event.participants) {
      const userDoc = await usersCollection.findOne({ id: user.id });
      if (userDoc) {
        const userEvents = userDoc.events;
        const eventIndex = userEvents.findIndex(
          (eventIter) => eventIter.title === event.title
        );
        if (user.id == 7) {
          console.log(userEvents);
        }
        if (eventIndex !== -1) {
          userEvents[eventIndex] = {
            ...userEvents[eventIndex],
            days: user.days,
          };
          if (user.id == 7) {
            console.log(userEvents[eventIndex]);
          }
          await usersCollection.updateOne(
            { id: user.id },
            { $set: { events: userEvents } }
          );
        }
      }
    }
    if (!eventDoc) {
      return new Response("Evento não encontrado", {
        status: 404,
      });
    }

    return new Response("Evento atualizado", {
      status: 200,
    });
  } catch (error) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
