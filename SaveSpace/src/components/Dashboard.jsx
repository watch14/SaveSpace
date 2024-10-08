"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  // Function to show toast notification
  const showToast = () => {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Call showToast on button click */}
      <Button onClick={showToast}>Show Toast</Button>
    </div>
  );
}
