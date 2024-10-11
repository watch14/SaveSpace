import React, { useEffect, useState } from "react";
import { storage, db } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function FileUpload({ onFileUploaded, onClose }) {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [fileUpload, setFileUpload] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch categories created by the user
  const getCategories = async () => {
    try {
      const data = await getDocs(collection(db, "category"));
      const categoryData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter categories to include only those created by the current user
      const userFilteredCategories = categoryData.filter(
        (category) => category.createdBy === currentUser.uid
      );

      setCategories(userFilteredCategories); // Set user-specific categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to handle file upload
  const uploadFile = async () => {
    if (!fileUpload || !selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a file and a category",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const user = currentUser.displayName;
      const storageRef = ref(storage, `${user}'s Files/${fileUpload.name}`);

      await uploadBytes(storageRef, fileUpload);
      const downloadURL = await getDownloadURL(storageRef);

      // Add file URL to the selected category
      const categoryRef = doc(db, "category", selectedCategory);
      await updateDoc(categoryRef, {
        files: arrayUnion(downloadURL),
      });

      setFileUpload(null);
      setSelectedCategory(null);
      setDialogOpen(false);
      toast({ title: "Success", description: "File uploaded successfully" });
      if (onFileUploaded) {
        onFileUploaded(); // Call the onCategoryCreated function passed as a prop
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, []);

  const handleClose = () => {
    setDialogOpen(false);

    if (onClose) {
      onClose(); // Call the onClose function passed as a prop
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Choose a file to upload and select a category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="file-upload" className="text-right">
              File
            </label>
            <Input
              id="file-upload"
              type="file"
              className="col-span-3"
              onChange={(e) => setFileUpload(e.target.files[0])}
              disabled={uploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="category" className="text-right">
              Category
            </label>
            <Select
              onValueChange={setSelectedCategory}
              value={selectedCategory}
              disabled={uploading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={uploadFile} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
