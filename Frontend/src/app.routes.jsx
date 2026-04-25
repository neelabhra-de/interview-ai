import { createBrowserRouter } from "react-router";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected"
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import MockInterview from "./features/interview/components/MockInterview";
import Landing from "./features/landing/pages/Landing";
import Connect from "./features/connect/pages/Connect";




export const router = createBrowserRouter( [
    {
        path: "/",
        element: <Landing />
    },
    {
        path: "/interview",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:id",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/mock-interview",
        element: <Protected><MockInterview /></Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/connect",
        element: <Connect />
    },
    
    
] )
