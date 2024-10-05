import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card } from "./ui/card";

// Define the form validation schema
const FormSchema = z.object({
  title: z.string().min(1, "Task title is required."),
  description: z.string().optional(),
  dob: z.date({
    required_error: "A deadline is required.",
  }),
});

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog open/close
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  // Function to fetch todos from Firestore
  const getTodos = async () => {
    try {
      const data = await getDocs(collection(db, "todoList"));
      const filteredData = data.docs.map((doc) => {
        const data = doc.data();
        const deadline = data.deadline
          ? new Date(data.deadline.seconds * 1000)
          : null;
        return {
          id: doc.id,
          ...data,
          deadline,
        };
      });
      console.log(filteredData);
      setTodos(filteredData);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Fetch todos from Firestore on component mount
  useEffect(() => {
    getTodos();
  }, []);

  // Submit handler for the form
  async function onSubmit(data) {
    const timestamp = Timestamp.fromDate(data.dob);

    // Save the new task to Firestore using addDoc for auto-generated ID
    try {
      await addDoc(collection(db, "todoList"), {
        title: data.title,
        description: data.description,
        done: false,
        deadline: timestamp,
      });
      console.log("Task created successfully!");
      // Refresh the todo list after creating a task
      await getTodos(); // Refetch todos after creating a new task
      form.reset(); // Reset the form fields after submission
      setDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error creating task: ", error);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <Card key={todo.id}>
            <p>{todo.title}</p>
            <p>{todo.description}</p>
            {todo.deadline && (
              <p>
                Deadline:
                {todo.deadline.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            <div className="flex items-center space-x-2 justify-center">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Done
              </label>
            </div>
          </Card>
        ))}
      </ul>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {" "}
        {/* Control dialog open state */}
        <DialogTrigger asChild>
          <Button onClick={() => setDialogOpen(true)}>
            {/* Open the dialog */}
            <Edit className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create To-Do</DialogTitle>
            <DialogDescription>Add a new todo item below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Task
                  </Label>
                  <Input id="title" {...form.register("title")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                  />
                </div>

                {/* Calendar Component for Deadline */}
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 text-right ">
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className="flex flex-row gap-3 justify-between w-full">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-fit pl-3 text-left font-normal ",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
