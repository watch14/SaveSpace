import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateCategory({ onCategoryCreated, onClose }) {
  const { currentUser } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const categoryRef = collection(db, "category");
  const { toast } = useToast();

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      await addDoc(categoryRef, {
        name: categoryName,
        createdBy: currentUser.uid,
        tasks: [],
      });
      toast({ title: "Success", description: "Category created successfully" });
      if (onCategoryCreated) {
        onCategoryCreated(); // Call the onCategoryCreated function passed as a prop
      }
      setCategoryName("");
      setDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error creating category: ", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCategoryName(""); // Reset the input field
    if (onClose) {
      onClose(); // Call the onClose function passed as a prop
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a category to organize your Space. (Try to keep the title
          simple and short).
        </DialogDescription>
        <Input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category title"
        />
        <DialogFooter>
          <Button type="button" onClick={handleCreateCategory}>
            Create Category
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
