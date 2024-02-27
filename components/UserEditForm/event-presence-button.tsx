"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { RotateCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MongoDBUser } from "@/types";

export default function EventPresenceButton({
  title,
  days,
  eventID,
  userID,
}: {
  title: string;
  days: boolean[];
  eventID: number;
  userID: number;
}) {
  const [daysUpdate, setDaysUpdate] = useState<boolean[]>(days);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync: sendUpdateFn } = useMutation({
    mutationFn: sendUpdate,
    onSuccess(response) {
      queryClient.setQueryData(["users"], (data: MongoDBUser[]) => {
        return data.map((elem) => {
          if (elem.id == userID) {
            const eventToUpdate = elem.events[eventID];
            eventToUpdate.days = daysUpdate;
            elem.events[eventID] = eventToUpdate;
            return { ...elem, events: [...elem.events] };
          }
          return elem;
        });
      });
    },
  });
  async function sendUpdate() {
    setIsLoading(true);
    try {
      const result = await axios.patch("/api/updateEventUser", {
        eventID: eventID + 1,
        daysUpdate,
        userID,
      });
      if (result.status == 200) {
        toast("Presença atualizada");
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <li
      key={title}
      className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 hover:shadow-sm duration-200 p-1.5 rounded-lg mb-2"
    >
      <p className="font-bold max-w-[50%]">{title.split("$")[0]}</p>
      <div
        className="flex space-x-2 data-[loading=true]:pointer-events-none data-[loading=true]:animate-pulse"
        data-loading={isLoading}
      >
        <ul className="flex space-x-3 items-start w-36 ">
          {days.map((_, index) => {
            return (
              <li key={index} className="flex flex-col items-center">
                <p>Dia {index + 1}</p>
                <Checkbox
                  className="h-4 w-4"
                  checked={daysUpdate[index]}
                  onClick={() => {
                    var toUpdate = [...daysUpdate];
                    toUpdate[index] = !toUpdate[index];
                    setDaysUpdate(toUpdate);
                  }}
                />
              </li>
            );
          })}
        </ul>
        <Button size={"sm"} onClick={() => sendUpdateFn()}>
          Atualizar presença{" "}
          <RotateCw
            data-loading={isLoading}
            className="data-[loading=false]:hidden animate-spin h-4"
          />
        </Button>
      </div>
    </li>
  );
}
