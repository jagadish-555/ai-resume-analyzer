import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import LoadingScreen from "./components/LoadingScreen";

const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const Protected = lazy(() => import("./features/auth/components/Protected"));
const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./features/interview/pages/Home"));
const Interview = lazy(() => import("./features/interview/pages/Interview"));
const NotFound = lazy(() => import("./pages/NotFound"));

const withSuspense = (element) => (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
        {element}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: withSuspense(<Landing />)
    },
    {
        path: "/login",
        element: withSuspense(<Login />)
    },
    {
        path: "/register",
        element: withSuspense(<Register />)
    },
    {
        path: "/home",
        element: withSuspense(<Protected><Home /></Protected>)
    },
    {
        path: "/interview/:interviewId",
        element: withSuspense(<Protected><Interview /></Protected>)
    },
    {
        path: "*",
        element: withSuspense(<NotFound />)
    }
]);