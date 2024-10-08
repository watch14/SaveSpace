"use client";

import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Button
        variant="outline"
        onClick={() => {
          toast.success("success", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }}
      >
        sucsess
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast.success("success");
        }}
      >
        sucsess
      </Button>

      <ToastContainer />
    </div>
  );
}
