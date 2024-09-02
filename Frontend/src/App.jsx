import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./Pages/AppLayout";
import Error from "./Pages/Error";
import Home from "./Pages/Home";
import Product from "./Pages/Product";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/:id",
        element: <Product />,
      },
    ],
  },
]);
function App() {
  return (
    <RouterProvider router={router}>
      <section className="min-h-screen"></section>
    </RouterProvider>
  );
}

export default App;
