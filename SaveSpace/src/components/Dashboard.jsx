"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const colors = [
  { name: "--background", className: "bg-background" },
  { name: "--foreground", className: "bg-foreground" },
  { name: "--card", className: "bg-card" },
  { name: "--card-foreground", className: "bg-card-foreground" },
  { name: "--popover", className: "bg-popover" },
  { name: "--popover-foreground", className: "bg-popover-foreground" },
  { name: "--primary", className: "bg-primary" },
  { name: "--primary-foreground", className: "bg-primary-foreground" },
  { name: "--secondary", className: "bg-secondary" },
  { name: "--secondary-foreground", className: "bg-secondary-foreground" },
  { name: "--muted", className: "bg-muted" },
  { name: "--muted-foreground", className: "bg-muted-foreground" },
  { name: "--accent", className: "bg-accent" },
  { name: "--accent-foreground", className: "bg-accent-foreground" },
  { name: "--destructive", className: "bg-destructive" },
  { name: "--destructive-foreground", className: "bg-destructive-foreground" },
  { name: "--border", className: "bg-border" },
  { name: "--input", className: "bg-input" },
  { name: "--ring", className: "bg-ring" },
  { name: "--radius", className: "bg-radius" },
  { name: "--chart-1", className: "bg-chart-1" },
  { name: "--chart-2", className: "bg-chart-2" },
  { name: "--chart-3", className: "bg-chart-3" },
  { name: "--chart-4", className: "bg-chart-4" },
  { name: "--chart-5", className: "bg-chart-5" },
];

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

      {/* Color Palette */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">Color Palette</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Color Name</th>
              <th className="border p-2">Class Name</th>
              <th className="border p-2">Swatch</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color, index) => (
              <tr key={index}>
                <td className="border p-2">{color.name}</td>
                <td className="border p-2">{color.className}</td>
                <td className={`border p-2 ${color.className} h-8 w-8`} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
