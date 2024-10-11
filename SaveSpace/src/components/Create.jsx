import { useState } from "react";
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

import { Plus } from "lucide-react";
import CreateTask from "./CreateTask";
import CreateCategory from "./CreateCategory";
import FileUpload from "./FileUpload";

export function Create() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
        <CreateTask
          onTaskCreated={() => setDialogOpen(false)}
          onClose={() => setDialogOpen(false)}
        />
        <CreateCategory
          onCategoryCreated={() => setDialogOpen(false)}
          onClose={() => setDialogOpen(false)}
        />
        <FileUpload
          onCategoryCreated={() => setDialogOpen(false)}
          onClose={() => setDialogOpen(false)}
        />
        {/* dialog content */}

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
