import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { storage } from "@/config/firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  File,
  Save,
  Edit,
  Trash2,
  Layers3,
  FileText,
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

export default function Files() {
  const { currentUser } = useAuth();
  const [fileUpload, setFileUpload] = useState(null);
  const [fileURLs, setFileURLs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchFiles();
    }
    setLoading(false);
  }, [currentUser]);

  const fetchFiles = async () => {
    try {
      const user = currentUser.displayName;
      const storageRef = ref(storage, `${user}'s Files/`);
      const fileList = await listAll(storageRef);

      const urls = await Promise.all(
        fileList.items.map(async (item) => {
          const downloadURL = await getDownloadURL(item);
          return {
            name: item.name,
            url: downloadURL,
          };
        })
      );

      setFileURLs(urls);
    } catch (error) {
      console.error("Error fetching files: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = currentUser.displayName;
      const storageRef = ref(storage, `${user}'s Files/${fileUpload.name}`);

      await uploadBytes(storageRef, fileUpload);
      await fetchFiles();
      setFileUpload(null);
      setDialogOpen(false);
      toast({ title: "Success", description: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file: ", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (fileName) => {
    try {
      const user = currentUser.displayName;
      const fileRef = ref(storage, `${user}'s Files/${fileName}`);
      await deleteObject(fileRef);
      await fetchFiles();
      toast({ title: "Success", description: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file: ", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const renderFilePreview = (file) => {
    const fileType = file.name.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-32 object-cover rounded"
        />
      );
    } else {
      return <FileText className="w-16 h-16 text-primary" />;
    }
  };

  const filteredFiles = fileURLs.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold">Files</h1>
        </div>
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
                Choose a file to upload to your SaveSpace.
              </DialogDescription>
            </DialogHeader>
            <Input
              id="file-upload"
              type="file"
              onChange={(e) => setFileUpload(e.target.files[0])}
            />
            <DialogFooter>
              <Button type="submit" onClick={uploadFile}>
                Upload File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files..."
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
              <StretchHorizontal className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {filteredFiles.map((file, index) => (
                <FileCard
                  key={index}
                  file={file}
                  deleteFile={deleteFile}
                  renderFilePreview={renderFilePreview}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4">
              {filteredFiles.map((file, index) => (
                <FileListItem
                  key={index}
                  file={file}
                  deleteFile={deleteFile}
                  renderFilePreview={renderFilePreview}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {filteredFiles.length === 0 && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">No Files Found</h2>
            <p className="text-muted-foreground text-center">
              {searchTerm
                ? "No files match your search. Try a different term."
                : "Upload a new file to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FileCard({ file, deleteFile, renderFilePreview }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center text-sm font-medium">
          <File className="mr-2 h-4 w-4 text-primary" />
          <span className="truncate">{file.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-center items-center h-32">
          {renderFilePreview(file)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button variant="outline" size="sm" asChild>
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </Button>
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
                file.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => deleteFile(file.name)}
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

function FileListItem({ file, deleteFile, renderFilePreview }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <div className="mr-4 w-16">{renderFilePreview(file)}</div>
          <span className="font-medium">{file.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </Button>
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
                  this file.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteFile(file.name)}
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
