import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Search from "./pages/SearchPage";
import SelectBook from "./pages/SelectBookPage";
import Stock from "./pages/StockPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Search />,
  },
  {
    path: "/select-book",
    element: <SelectBook />,
  },
  {
    path: "/stock",
    element: <Stock />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
