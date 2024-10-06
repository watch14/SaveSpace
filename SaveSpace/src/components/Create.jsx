import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateTask from "./CreateTask";
import { Plus } from "lucide-react";

export function Create() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <a
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Plus className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </a>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-scroll w-[600px] max-h-[80%]">
        <DialogHeader>
          <DialogTitle>SaveSpace</DialogTitle>
          <DialogDescription>
            Create whatever your heart desire.
          </DialogDescription>
        </DialogHeader>

        {/* dialog content */}
        <CreateTask />
        {/* dialog content */}

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
