import { MongoDBUser } from "@/types";
import { MongoClient } from "mongodb";

export async function GET(req: Request) {
  const token = req.headers.get("token");
  if (token != process.env.CRYPTO_KEY) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGO_URI!
    );
    const db = client.db("seelect_main");

    // Get all users from the MongoDB collection
    const users = await db
      .collection<MongoDBUser>("users")
      .find()
      .limit(10)
      .toArray();
    const msg_lines = [
      "Participou da Semana de Engenharia Elétrica, de",
      "Computação e de Telecomunicações da Universidade",
      "Federal do Ceará no período de 6 a 10 novembro ",
    ];
    users.forEach((user) => {
      var hours = 0;

      user.events.forEach((event, index) => {
        event.days.forEach((day, i) => {
          if (day) {
            hours += event.hours_per_day[i] / 60;
          }
        });
      });
      console.log(`de 2023 totalizando ${hours + 2} horas`);
    });

    // Close the MongoDB connection
    await client.close();

    return Response.json(users);
  } catch (error) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
