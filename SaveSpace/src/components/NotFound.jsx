import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground ">
      {/* <FileQuestion className="h-32 w-32 text-muted-foreground" /> */}
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <a href="/">Return to Home</a>
      </Button>
    </div>
  );
}
