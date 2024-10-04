import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[300px]">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-semibold text-foreground">
            Loading...
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we fetch your content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
