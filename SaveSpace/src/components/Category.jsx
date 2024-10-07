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
    <div className="container mx-auto px-4 py-8">
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
                Create a category to organize your Space.
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
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="mr-2 h-5 w-5 text-primary" />
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
                      className="ml-2 w-full"
                    />
                  ) : (
                    category.name
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500">
                  Tasks: {category.tasks?.length || 0}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                {editingCategory === category.id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCategory(category.id, category.name)}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCategory(category.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCategory(category.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-semibold">No Categories Found</h2>
          <p className="mt-2 text-gray-500">
            {searchTerm
              ? "No categories match your search. Try a different term."
              : "Create a new category to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
