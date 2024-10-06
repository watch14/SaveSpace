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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Edit, Trash2, Plus, Search } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { format, isAfter, isBefore, isEqual } from "date-fns";
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  title: z.string().min(1, "Task title is required."),
  description: z.string().optional(),
  dob: z.date().optional(),
  category: z.string().min(1, "Category is required."),
});

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState("none");
  const [newCategory, setNewCategory] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      dob: undefined,
      category: "",
    },
  });

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
      setTodos(filteredData);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

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
    getTodos();
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
      await getTodos();
      form.reset();
      setDialogOpen(false);
      setEditingTodo(null);
      setNewCategory("");
    } catch (error) {
      console.error("Error saving task: ", error);
    }
  }

  const toggleTodo = async (id, done) => {
    try {
      await updateDoc(doc(db, "todoList", id), { done: !done });
      await getTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id, categoryId) => {
    try {
      await deleteDoc(doc(db, "todoList", id));

      // Remove the task from the category's tasks array
      const categoryRef = doc(db, "category", categoryId);
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        await updateDoc(categoryRef, {
          tasks: category.tasks.filter((taskId) => taskId !== id),
        });
      }

      await getTodos();
      await getCategories();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const editTodo = (todo) => {
    setEditingTodo(todo);
    form.reset({
      title: todo.title,
      description: todo.description,
      dob: todo.deadline,
      category: todo.category,
    });
    setDialogOpen(true);
  };

  const filteredTodos = todos
    .filter((todo) => {
      const matchesCategory =
        !categoryFilter || todo.category === categoryFilter;
      const matchesFilter =
        filter === "all" ||
        (filter === "done" && todo.done) ||
        (filter === "notDone" && !todo.done);
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDate =
        !dateFilter ||
        (todo.deadline &&
          (isEqual(todo.deadline, dateFilter) ||
            (isBefore(todo.deadline, dateFilter) &&
              isAfter(todo.deadline, new Date()))));
      return matchesCategory && matchesFilter && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (sortOrder === "soonest") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortOrder === "latest") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(b.deadline) - new Date(a.deadline);
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTodo(null);
                form.reset();
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? "Edit Task" : "Create Task"}
              </DialogTitle>
              <DialogDescription>
                {editingTodo
                  ? "Edit your todo item below."
                  : "Add a new todo item below."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                          <SelectItem value="new">
                            Create new category
                          </SelectItem>
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
      </div>
      <div className="mb-6 grid flex-col sm:flex-row gap-4 w-full">
        <div className="">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="notDone">On Going</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="">
              <SelectValue placeholder="Sort by deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="soonest">Soonest</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="category" className="sr-only">
            Filter by category
          </Label>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTodos.map((todo) => (
          <Card
            key={todo.id}
            className={cn(
              todo.done && "opacity-60",
              "flex flex-col justify-between "
            )}
          >
            <CardHeader>
              <CardTitle className="grid grid-flow-col justify-between text-left overflow-clip">
                <span
                  className={cn(
                    todo.done && "line-through",
                    "overflow-hidden text-ellipsis w-full pb-1"
                  )}
                >
                  {todo.title}
                </span>
                <Badge variant="outline" className="h-fit w-fit">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {todo.deadline
                    ? format(todo.deadline, "MMM d, yyyy")
                    : "No deadline"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {todo.description}
              </p>

              <Badge variant="outline" className="h-fit w-fit mt-2 ">
                {categories.find((c) => c.id === todo.category)?.name ||
                  "No category"}
              </Badge>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.done}
                  onCheckedChange={() => toggleTodo(todo.id, todo.done)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {todo.done ? "Completed" : "Mark as complete"}
                </label>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => editTodo(todo)}
                  disabled={todo.done}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteTodo(todo.id, todo.category)}
                  disabled={todo.done}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
