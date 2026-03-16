import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";
import { Protected } from "./features/auth/components/Protected";
import { GuestOnly } from "./features/auth/components/GuestOnly";
import Home from "./pages/Home";
import Dashboard from "./features/interview/pages/Dashboard";
import { InterviewReport } from "./features/interview/pages/InterviewReport";
import AppLayout from "./components/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <GuestOnly />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    element: <Protected />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
      {
        element: <AppLayout backTo="/dashboard" backLabel="Back to dashboard" />,
        children: [
          {
            path: "/interview/:id",
            element: <InterviewReport />,
          },
        ],
      },
    ],
  },
]);
