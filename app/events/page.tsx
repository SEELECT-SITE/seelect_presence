import { EventEditForm } from "@/components/EventEditForm";
import EventsTable from "@/components/EventsTable";
import { Toaster } from "@/components/ui/sonner";
export default function EventsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <EventsTable />
      <EventEditForm />
      <Toaster />
    </main>
  );
}
