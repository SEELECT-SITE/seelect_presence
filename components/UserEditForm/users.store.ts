import { MongoDBUser } from "@/types";
import { create } from "zustand";

type UsersPage = {
  isUserFormOpen: boolean;
  setIsUserFormOpen: (update: boolean) => void;
  toEditUser: MongoDBUser | null;
  setToEditUser: (update: MongoDBUser | null) => void;
};

const useUserPageState = create<UsersPage>((set) => ({
  isUserFormOpen: false,
  setIsUserFormOpen: (update: boolean) => {
    set((state) => ({ isUserFormOpen: update }));
  },
  toEditUser: null,
  setToEditUser: (update: MongoDBUser | null) => {
    set((state) => ({ toEditUser: update }));
  },
}));

export default useUserPageState;
