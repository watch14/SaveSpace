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
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Folder,
  Save,
  Edit,
  Trash2,
  Layers3,
  ListChecks,
  LayoutGrid,
  StretchHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Category() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const categoryRef = collection(db, "category");
  const { toast } = useToast();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const data = await getDocs(categoryRef);
      const categoryList = data.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((category) => category.createdBy === currentUser?.uid);
      setCategories(categoryList);
    } catch (error) {
      console.error("Error getting documents: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
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
      toast({ title: "Success", description: "Category created successfully" });
    } catch (error) {
      console.error("Error creating category: ", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, "category", id));
      getCategories();
      toast({ title: "Success", description: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (id, name) => {
    try {
      await updateDoc(doc(db, "category", id), { name });
      getCategories();
      setEditingCategory(null);
      toast({ title: "Success", description: "Category updated successfully" });
    } catch (error) {
      console.error("Error updating category: ", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container min-w-full px-4">
      <div className="flex justify-between items-center mb-6 w-full">
        <div className="flex items-center gap-3">
          <Layers3 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Categories</h1>
        </div>
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
                Create a category to organize your Space. (Try to keep the
                category title simple and short).
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

      <Tabs defaultValue="list" className="w-full">
        <div className="flex justify-between items-center mb-6 gap-4 ">
          <div className="relative w-full">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-full"
            />
          </div>
          <TabsList>
            <TabsTrigger className="h-fit w-fit" value="grid">
              <LayoutGrid />
            </TabsTrigger>
            <TabsTrigger value="list">
              <StretchHorizontal className="h-5 w-5 " />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  editingCategory={editingCategory}
                  setEditingCategory={setEditingCategory}
                  updateCategory={updateCategory}
                  deleteCategory={deleteCategory}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <CategoryListItem
                  key={category.id}
                  category={category}
                  editingCategory={editingCategory}
                  setEditingCategory={setEditingCategory}
                  updateCategory={updateCategory}
                  deleteCategory={deleteCategory}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {filteredCategories.length === 0 && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">No Categories Found</h2>
            <p className="text-muted-foreground text-center">
              {searchTerm
                ? "No categories match your search. Try a different term."
                : "Create a new category to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CategoryCard({
  category,
  editingCategory,
  setEditingCategory,
  updateCategory,
  deleteCategory,
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Folder className="mr-2 h-5 w-5 text-primary" />
          {editingCategory === category.id ? (
            <Input
              type="text"
              value={category.name}
              onChange={(e) => updateCategory(category.id, e.target.value)}
              className="ml-2"
            />
          ) : (
            <span className="truncate text-left w-full pb-1">
              {category.name}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow ">
        {/* tasks */}
        <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
          <ListChecks className="w-4 h-4 mr-1" />
          Tasks:
          <strong className="ml-1"> {category.tasks?.length || 0}</strong>
        </div>
        {/* tasks */}
      </CardContent>
      <CardFooter className="flex space-x-2 justify-end">
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
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                category.
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
  );
}

function CategoryListItem({
  category,
  editingCategory,
  setEditingCategory,
  updateCategory,
  deleteCategory,
}) {
  return (
    <Card>
      <CardContent className="grid grid-cols-3 items-center justify-between py-4">
        <div className="flex items-center">
          <Folder className="mr-2 h-5 w-5 text-primary" />
          {editingCategory === category.id ? (
            <Input
              type="text"
              value={category.name}
              onChange={(e) => updateCategory(category.id, e.target.value)}
              className="ml-2"
            />
          ) : (
            <span className="font-medium">{category.name}</span>
          )}
        </div>
        {/* tasks */}
        <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground w-fit">
          <ListChecks className="w-4 h-4 mr-1" />
          Tasks:
          <strong className="ml-1"> {category.tasks?.length || 0}</strong>
        </div>
        {/* tasks */}
        <div className="flex items-center space-x-2 ml-auto">
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
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this category.
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
        </div>
      </CardContent>
    </Card>
  );
}
