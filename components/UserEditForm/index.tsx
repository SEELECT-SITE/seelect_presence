"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import UserEditForm from "@/components/UserEditForm/form";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import useUserPageState from "./users.store";

export function UserDrawer() {
  const { isUserFormOpen, setIsUserFormOpen, toEditUser } = useUserPageState();

  return (
    <Drawer open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
      <DrawerContent className="px-12 py-6 ">
        <div className="max-w-3xl m-auto">
          <DrawerHeader className="text-left flex justify-between items-start">
            <div>
              <DrawerTitle>Editando presença de {toEditUser?.name}</DrawerTitle>
              <DrawerDescription className="mt-1">
                Atualize as informações do usuario
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:text-red-500"
              >
                <span className="sr-only">
                  Fechar formulario de novo produto
                </span>
                <Cross2Icon className="h-6 w-6" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4">
            <UserEditForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
