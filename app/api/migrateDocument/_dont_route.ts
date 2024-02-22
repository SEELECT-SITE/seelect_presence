// pages/api/createDocuments.ts

import { MongoClient } from "mongodb";
import axios from "axios";
import { diffInMinutes, encryptSensitive } from "@/lib/utils";
/* 
export async function GET(res: Request) {
  return Response.json({ message: "hello" });
}
 */
export type MongoDBUser = {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  events: { title: string; days: boolean[] }[];
};
export async function GET(req: Request) {
  try {
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGO_URI!
    );
    const db = client.db("seelect_main");

    // Fetch users data from external API
    const { data: usersRequest } = await axios.get<{ results: any[] }>(
      "http://127.0.0.1:8000/api/users/",
      {
        headers: { Token: "bcc7f7eb580cfeb37ce377f61e216810" },
      }
    );

    // Process each user to fetch additional data
    const users: MongoDBUser[] = [];
    for (const elem of usersRequest.results) {
      const { data } = await axios.get<{
        profile: {
          cpf: string;
          kit: {
            events: {
              id: number;
              date: any;
              title: string;
            }[];
          };
        };
      }>(`http://127.0.0.1:8000/api/users/${elem.role}/${elem.id}/`, {
        headers: { Token: "bcc7f7eb580cfeb37ce377f61e216810" },
      });

      // Extract events data
      const events = data.profile.kit
        ? data.profile.kit.events.map((event: any) => {
            const days = Object.values(event.date).map((_, index) => {
              return false;
            });
            const hours_per_day = Object.values(event.date).map(
              (elem, index) => {
                //@ts-ignore
                return diffInMinutes(new Date(elem.start), new Date(elem.end));
              }
            );
            return { title: event.title, days, hours_per_day };
          })
        : [];
      if (events.length > 0) {
        users.push({
          id: elem.id,
          name: `${elem.profile.first_name} ${elem.profile.last_name}`,
          email: elem.email,
          events,
          cpf: elem.profile.cpf,
        });
      }
    }

    await db.collection("users").insertMany(users);

    await client.close();
    // Insert each element of the array into the MongoDB collection

    return new Response("All documents are inserted", {
      status: 200,
    });
  } catch (error) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
