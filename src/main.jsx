import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className=" font-poppins max-w-[1650px] mx-auto">
    <RouterProvider router={router} />
    </div>
  </StrictMode>
);
