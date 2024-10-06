"use client";

import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  Timestamp,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isBefore } from "date-fns";

const FormSchema = z.object({
  title: z.string().min(1, "Task title is required."),
  description: z.string().optional(),
  dob: z.date().optional(),
  category: z.string().min(1, "Category is required."),
});

export default function CreateTask({ editingTodo = null }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: editingTodo ? editingTodo.title : "",
      description: editingTodo ? editingTodo.description : "",
      dob: editingTodo ? editingTodo.deadline : undefined,
      category: editingTodo ? editingTodo.category : "",
    },
  });

  const getCategories = async () => {
    try {
      const data = await getDocs(collection(db, "category"));
      const categoryData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  async function onSubmit(data) {
    const timestamp = data.dob ? Timestamp.fromDate(data.dob) : null;
    try {
      let categoryId = data.category;
      if (data.category === "new" && newCategory.trim() !== "") {
        const newCategoryRef = await addDoc(collection(db, "category"), {
          name: newCategory,
          tasks: [],
        });
        categoryId = newCategoryRef.id;
        await getCategories();
      }

      if (editingTodo) {
        await updateDoc(doc(db, "todoList", editingTodo.id), {
          title: data.title,
          description: data.description,
          deadline: timestamp,
          category: categoryId,
        });
      } else {
        const newTodoRef = await addDoc(collection(db, "todoList"), {
          title: data.title,
          description: data.description,
          done: false,
          deadline: timestamp,
          category: categoryId,
        });

        // Update the category's tasks array
        const categoryRef = doc(db, "category", categoryId);
        await updateDoc(categoryRef, {
          tasks: [
            ...(categories.find((c) => c.id === categoryId)?.tasks || []),
            newTodoRef.id,
          ],
        });
      }
      form.reset();
      setDialogOpen(false);
      setNewCategory("");
    } catch (error) {
      console.error("Error saving task: ", error);
    }
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />{" "}
          {editingTodo ? "Edit Task" : "Create Task"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-scroll w-[600px] max-h-[80%]">
        <DialogHeader>
          <DialogTitle>{editingTodo ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {editingTodo
              ? "Edit your todo item below."
              : "Add a new todo item below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-[240px] pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>No deadline</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">Create new category</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("category") === "new" && (
              <FormItem>
                <FormLabel>New Category Name</FormLabel>
                <FormControl>
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                  />
                </FormControl>
              </FormItem>
            )}
            <DialogFooter>
              <Button type="submit">
                {editingTodo ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
