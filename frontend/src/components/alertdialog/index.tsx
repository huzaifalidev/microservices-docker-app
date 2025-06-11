// components/global-alert-dialog-provider.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { createContext, useContext, useState, ReactNode } from "react";

type DialogData = {
  title: string;
  description: string;
  onConfirm: () => void;
};

type AlertDialogContextType = {
  showDialog: (data: DialogData) => void;
};

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export const useAlertDialog = () => {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error("useAlertDialog must be used within AlertDialogProvider");
  return ctx;
};

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);

  const showDialog = (data: DialogData) => {
    setDialogData(data);
    setOpen(true);
  };

  const handleConfirm = () => {
    dialogData?.onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialogContext.Provider value={{ showDialog }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogData?.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogData?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}
