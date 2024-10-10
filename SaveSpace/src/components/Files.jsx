import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import { storage } from "@/config/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ref, uploadBytes } from "firebase/storage";
import Loading from "./ui/loader";

export default function Files() {
  const { currentUser } = useAuth();
  const [fileUpload, setFileUpload] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Function to submit file
  const uploadFile = async () => {
    try {
      if (fileUpload) {
        const user = currentUser.displayName;
        const storageRef = ref(storage, `${user}'s Files/${fileUpload.name}`);

        await uploadBytes(storageRef, fileUpload);
        console.log("File uploaded successfully");
      } else {
        console.error("No file selected");
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Files</h1>

      <h2 className="text-lg font-bold mb-2">Import File</h2>

      <div className="felx felx-col justify-between items-center gap 3">
        <Input
          id="picture"
          type="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <Button onClick={uploadFile}>Upload File</Button>
      </div>
    </div>
  );
}
