import { create } from "zustand";
import { EventProps } from "@/types";

type EventsPage = {
  isEventFormOpen: boolean;
  setIsEventFormOpen: (update: boolean) => void;
  toEditEvent: EventProps | null;
  setToEditEvent: (update: EventProps | null) => void;
};

const useEventPageState = create<EventsPage>((set) => ({
  isEventFormOpen: false,
  setIsEventFormOpen: (update: boolean) => {
    set((state) => ({ isEventFormOpen: update }));
  },
  toEditEvent: null,
  setToEditEvent: (update: EventProps | null) => {
    set((state) => ({ toEditEvent: update }));
  },
}));

export default useEventPageState;
