import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById("app"),
  <RouterProvider router={router} />,
);
