"use client";
import useUserPageState from "./users.store";
import EventPresenceButton from "./event-presence-button";
import { ScrollArea } from "../ui/scroll-area";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MongoDBUser } from "@/app/api/migrateDocument/_dont_route";

const insertEventSchema = z.object({
  title: z.string().min(1, "Nome de usuario é obrigatório"),
  hours_per_day: z.coerce.number().min(1, "Preço é obrigatório"),
});

export type insertEventData = z.infer<typeof insertEventSchema>;

export default function ProductEditForm() {
  const { toEditUser } = useUserPageState();
  const form = useForm<insertEventData>({
    resolver: zodResolver(insertEventSchema),
  });
  const queryClient = useQueryClient();
  const { mutateAsync: insertEventFn } = useMutation({
    mutationFn: async (insertEventAPIProps: any) => {
      const result = await axios.patch("/api/insertEvent", insertEventAPIProps);
      return result;
    },
    onSuccess(_, variables) {
      queryClient.setQueryData(["users"], (data: MongoDBUser[]) => {
        return data.map((elem) => {
          if (elem.id == toEditUser?.id) {
            const events = elem.events;
            events.push({
              title: variables.event.title,
              days: [true],
            });
            return { ...elem, events: [...events] };
          }
          return elem;
        });
      });
    },
  });

  async function insertEvent(eventData: insertEventData) {
    const insertEventAPIProps = {
      userID: toEditUser?.id,
      event: {
        title: eventData.title,
        days: [true],
        hours_per_day: [eventData.hours_per_day * 60],
      },
    };
    try {
      const result = await insertEventFn(insertEventAPIProps);
      if (result.status == 200) {
        toast("Evento inserido");
        form.reset();
      }
    } catch (e) {
      console.log(e);
      toast(
        "Algo deu errado. Tente novamente em instantes ou verifique sua conexão."
      );
    }
  }
  return (
    <ScrollArea className="h-96 rounded-md border px-4 py-2">
      <div className="px-2">
        <Accordion type="single" collapsible className="w-full mb-6">
          <AccordionItem value="item-1">
            <AccordionTrigger>Inserir novo evento?</AccordionTrigger>
            <AccordionContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(insertEvent)}
                  className="flex flex-col gap-4 px-1"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo do evento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Coloque o titulo do evento"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours_per_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horas totais de evento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Coloque as horas totais de evento"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="float-left">Inserir novo evento</Button>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <ul className="px-1">
          {toEditUser?.events.map((elem, index) => {
            return (
              <EventPresenceButton
                key={elem.title}
                {...elem}
                eventID={index}
                userID={toEditUser.id}
              />
            );
          })}
        </ul>
      </div>
    </ScrollArea>
  );
}
