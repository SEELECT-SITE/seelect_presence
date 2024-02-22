"use client";

import useUserPageState from "./users.store";
import EventPresenceButton from "./event-presence-button";
import { ScrollArea } from "../ui/scroll-area";

export default function ProductEditForm() {
  const { toEditUser } = useUserPageState();

  return (
    <ScrollArea className="h-96 rounded-md border px-4 py-2">
      <ul>
        {toEditUser?.events.map((elem, index) => {
          return (
            <EventPresenceButton
              {...elem}
              eventID={index}
              userID={toEditUser.id}
            />
          );
        })}
      </ul>
    </ScrollArea>
  );
}
