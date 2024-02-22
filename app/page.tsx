import { UserDrawer } from "@/components/UserEditForm";
import UsersTable from "@/components/UserTable";
import { Toaster } from "@/components/ui/sonner";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <UsersTable />
      <UserDrawer />
      <Toaster />
    </main>
  );
}
