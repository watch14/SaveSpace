"use client";

import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus } from "lucide-react";

// Toast
import { useToast } from "@/hooks/use-toast";

// Define the form schema using Zod
const FormSchema = z.object({
  title: z.string().min(1, "Task title is required."),
  description: z.string().optional(),
  dob: z.date().optional(),
  category: z.string().min(1, "Category is required."),
  collaborators: z.array(z.string()).optional(),
});

export default function CreateTask({ onTaskCreated }) {
  const { currentUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      dob: undefined,
      category: "",
    },
  });

  const getCategories = async () => {
    try {
      const data = await getDocs(collection(db, "category"));
      const categoryData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const userFilteredCategories = categoryData.filter(
        (category) => category.createdBy === currentUser.uid
      );
      setCategories(userFilteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (data) => {
    const timestamp = data.dob ? Timestamp.fromDate(data.dob) : null;
    const userId = currentUser.uid;

    try {
      let categoryId = data.category;

      if (data.category === "new" && newCategory.trim() !== "") {
        const newCategoryRef = await addDoc(collection(db, "category"), {
          name: newCategory,
          createdBy: userId,
          collaborators: [],
          tasks: [],
        });
        categoryId = newCategoryRef.id;
        await getCategories();
        setDialogOpen(false);
      }

      await addDoc(collection(db, "todoList"), {
        title: data.title,
        description: data.description,
        done: false,
        deadline: timestamp,
        category: categoryId,
        createdBy: userId,
        collaborators: data.collaborators || [],
      });

      // Show success toast notification
      setDialogOpen(false);

      toast({
        title: "Task created !",
        description: "You can view your task in the task page.",
      });

      form.reset();
      setNewCategory("");
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error("Error creating task: ", error);
      toast({
        title: "Error Creating The Task!",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] overflow-scroll w-[600px] max-h-[80%]">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new task.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
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
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">Add new category</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("category") === "new" && (
                <FormField
                  control={form.control}
                  name="newCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Category Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="collaborators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collaborators (User Emails)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={(field.value || []).join(",")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((email) => email.trim())
                          )
                        }
                        placeholder="Enter comma-separated emails of collaborators"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Task</Button>
            </form>
          </Form>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
