import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Loading from "./ui/loader";

import {
  Card,
  CardContent,
  CardDescription,
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
import { CalendarIcon, Edit, Trash2, Plus, Search } from "lucide-react";

export default function Category() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [userCategories, setUserCategories] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const categoryRef = collection(db, "category");

  const getCategories = async () => {
    try {
      const data = await getDocs(categoryRef);
      const categoryList = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
      console.log("Categories: ", categoryList);

      // Filter categories based on the current user's ID
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
    try {
      await addDoc(categoryRef, {
        name: categoryName,
        createdBy: currentUser.uid,
        tasks: [],
      });
      getCategories();
      setDialogOpen(false);
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

  useEffect(() => {
    getCategories();
    console.log(" Category name: ", categoryName);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Categories</h1>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <span>
            <Button>Create Category</Button>
          </span>
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

      {/* Show categories here */}
      {/* Show categories here */}
      {userCategories.length > 0 ? (
        userCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              Tasks: {category.tasks?.length || 0}
              <p>I'm gonna add more stuff here later</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <>
          <p>
            You have no Categories.
            <br />
            Create a new category to get started.
          </p>
        </>
      )}
    </div>
  );
}
