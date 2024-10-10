import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Files() {
  // Function to submit file
  const submitFile = () => {
    // Add code here
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Files</h1>

      {/* upload file */}
      <div className="flex flex-col items-center p-4">
        <h2 className="text-lg font-bold mb-2">Import File</h2>
        <Input id="picture" type="file" />
        <Button onClick={submitFile}>Upload File</Button>
      </div>
    </div>
  );
}
