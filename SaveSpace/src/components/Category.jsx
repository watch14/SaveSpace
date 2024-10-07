import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import Loading from "./ui/loader";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  Edit,
  Trash2,
  Plus,
  Search,
  Folder,
  Save,
} from "lucide-react";

export default function Category() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [userCategories, setUserCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const categoryRef = collection(db, "category");

  const getCategories = async () => {
    try {
      const data = await getDocs(categoryRef);
      const categoryList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);

      const userFilteredCategories = categoryList.filter(
        (category) => category.createdBy === currentUser?.uid
      );

      setUserCategories(userFilteredCategories);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      await addDoc(categoryRef, {
        name: categoryName,
        createdBy: currentUser.uid,
        tasks: [],
      });
      getCategories();
      setDialogOpen(false);
      setCategoryName("");
    } catch (error) {
      console.error("Error creating category: ", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, "category", id));
      getCategories();
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const updateCategory = async (id, name) => {
    try {
      await updateDoc(doc(db, "category", id), { name });
      getCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category: ", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const filteredCategories = userCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
                <DialogDescription>
                  <p>
                    Create a category to organize your Space.
                    <br />
                    (Try to keep the category title simple and short).
                  </p>
                </DialogDescription>
              </DialogHeader>
              <Input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category title"
              />
              <DialogFooter>
                <Button type="submit" onClick={createCategory}>
                  Create Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative ">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 "
            />
          </div>
        </div>

        <div className="w-full">
          {filteredCategories.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Folder className="mr-2 h-5 w-5 text-primary " />
                      {editingCategory === category.id ? (
                        <Input
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            const updatedCategories = userCategories.map((c) =>
                              c.id === category.id
                                ? { ...c, name: e.target.value }
                                : c
                            );
                            setUserCategories(updatedCategories);
                          }}
                          className="ml-2  "
                        />
                      ) : (
                        <span className="truncate text-left w-full h-full pb-1 ">
                          {category.name}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-500">
                      Tasks: {category.tasks?.length || 0}
                    </p>
                  </CardContent>
                  <CardFooter className="flex space-x-2 justify-end">
                    {editingCategory === category.id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateCategory(category.id, category.name)
                        }
                      >
                        <Save className="mr-2 h-4 w-4" /> Save
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category.id)}
                      >
                        <Edit className=" h-4 w-4" />
                      </Button>
                    )}
                    {/* alert are you sure you want to delete this category */}
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <span>
                          <Button variant="destructive" size="sm">
                            <Trash2 className=" h-4 w-4" />
                          </Button>
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-lg font-semibold mb-2">
                  No Categories Found
                </h2>
                <p className="text-gray-500 text-center">
                  {searchTerm
                    ? "No categories match your search. Try a different term."
                    : "Create a new category to get started."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
