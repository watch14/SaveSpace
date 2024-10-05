import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Calendar } from "@/components/ui/calendar";

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

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("null");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const data = await getDocs(collection(db, "todoList"));
        const filteredData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(filteredData);
        setTodos(filteredData);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    getTodos();
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data) {
    console.log(data.dob);
    setDate(data.dob);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <p>{todo.title}</p>
            <p>{todo.description}</p>
            <p>{todo.done ? "✅" : "❌"}</p>
          </li>
        ))}
      </ul>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Edit className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create To-Do</DialogTitle>
            <DialogDescription>Add a new todo item below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Task
              </Label>
              <Input id="title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Description
              </Label>
              <Textarea id="description" className="col-span-3" />
            </div>

            {/*                           Calender                              */}
            {/* llllllllllllllllllllllllllllllllllllllllllllllllllllllllllll */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                <Button type="submit">Submit</Button>
              </form>
            </Form>
            {/* llllllllllllllllllllllllllllllllllllllllllllllllllllllllllll */}
            {/* llllllllllllllllllllllllllllllllllllllllllllllllllllllllllll */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
