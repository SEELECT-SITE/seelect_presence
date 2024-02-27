"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Cross2Icon } from "@radix-ui/react-icons";
import useUserPageState from "./event.store";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EventProps } from "@/types";

export function EventEditForm() {
  const { isEventFormOpen, setIsEventFormOpen, toEditEvent, setToEditEvent } =
    useUserPageState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateCount, setUpdateCount] = useState<number>(0);
  const queryClient = useQueryClient();
  const { mutateAsync: sendUpdateFn } = useMutation({
    mutationFn: sendUpdate,
    onSuccess(response) {
      queryClient.setQueryData(["events"], (data: EventProps[]) => {
        return data.map((elem) => {
          return elem.title == toEditEvent?.title ? toEditEvent : elem;
        });
      });
    },
  });
  useEffect(() => {
    setUpdateCount(0);
  }, [isEventFormOpen]);
  function handleUpdateParticipants(day_index: number, name: string) {
    const event = { ...toEditEvent };
    const updatedEvent = event.participants?.map((participant) => {
      if (participant.name == name) {
        const days = [...participant.days];
        var updatedDays = days.map((day, index) => {
          if (day_index == index) {
            return !day;
          }
          return day;
        });
        return { ...participant, days: updatedDays };
      }
      return participant;
    });
    setToEditEvent({
      ...toEditEvent,
      //@ts-ignore
      participants: updatedEvent,
    });
    setUpdateCount(updateCount + 1);
  }

  async function sendUpdate() {
    setIsLoading(true);
    try {
      await axios("/api/updateEvent", {
        method: "PATCH",
        data: { event: toEditEvent },
      }).then((res) => {
        if (res.status == 200) {
          toast.success("Evento atualizado");
          setIsEventFormOpen(false);
        } else {
          toast.error("Erro ao atualizar evento");
        }
      });
    } catch (e) {
      toast.error("Erro ao atualizar evento");
    } finally {
      setIsLoading(false);
    }
  }
  if (!toEditEvent) return null;
  return (
    <Drawer open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
      <DrawerContent className="px-12 py-6 ">
        <div className="max-w-5xl m-auto">
          <DrawerHeader className="text-left flex justify-between items-start py-4 gap-4">
            <div>
              <DrawerTitle>
                Editando presença de {toEditEvent?.title}
              </DrawerTitle>
              <DrawerDescription className="mt-1">
                Atualize as informações do evento
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:text-red-500"
              >
                <span className="sr-only">Fechar formulario de eventos</span>
                <Cross2Icon className="h-6 w-6" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 py-2">
            <Button
              size={"sm"}
              disabled={updateCount == 0}
              data-loading={isLoading}
              className="data-[loading=true]:animate-pulse data-[loading=true]:pointer-events-none"
              onClick={() => sendUpdateFn()}
            >
              Atualizar presenças
              <RotateCw
                data-loading={isLoading}
                className="data-[loading=false]:hidden animate-spin h-4"
              />
            </Button>
          </div>
          <ScrollArea className="h-72 w-full">
            <ul className="p-4 ">
              <li className="flex gap-2 justify-between w-full my-2 dark:border-zinc-700 border-zinc-200 py-1 border-b">
                <p>Participantes</p>
                <ul className="flex space-x-3 justify-between w-36">
                  {toEditEvent?.participants[0].days.map((_, index) => {
                    return (
                      <li key={index} className="flex flex-col items-center">
                        Dia {index + 1}
                      </li>
                    );
                  })}
                </ul>
              </li>
              {toEditEvent?.participants
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((elem, p_index) => {
                  return (
                    <li
                      key={elem.name}
                      className="flex gap-2 justify-between w-full my-2 dark:border-zinc-700 border-zinc-200 py-1 border-b dark:hover:bg-zinc-900 hover:bg-zinc-100 items-center"
                    >
                      <p>{elem.name}</p>
                      <ul className="flex space-x-3 justify-between  w-36 px-4">
                        {elem.days.map((_, index) => {
                          return (
                            <li
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <Checkbox
                                className="h-4 w-4"
                                checked={
                                  toEditEvent.participants[p_index].days[index]
                                }
                                onClick={() =>
                                  handleUpdateParticipants(index, elem.name)
                                }
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
            </ul>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
