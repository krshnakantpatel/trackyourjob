import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../features/AuthSlice";
import PublicProtected from "./protected/PublicProtected";
import MainProtected from "./protected/MainProtected";
import AddJob from "../pages/AddJob";
import Applications from "../pages/Applications";
import JobDetails from "../pages/JobDetails";
import InterviewNotes from "../pages/InterviewNotes";
import InterviewExperienceCard from "../pages/InterviewExperienceCard";

const AppRoutes = () => {

    let dispatch = useDispatch();

    const hydrateUser = () => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            const token = localStorage.getItem("token");

            if (loggedInUser && token) {
                dispatch(addUser({ user: loggedInUser, token }));
            }
        } catch (e) {
            console.error("Failed to hydrate user from storage", e);
        }
    };

    useEffect(() => {
        hydrateUser();
    }, []);

    let router = createBrowserRouter([
        {
            path: "/",
            element: <PublicProtected />,
            children: [
                {
                    path: "",
                    element: <AuthLayout />,
                    children: [
                        {
                            path: "",
                            element: <Login />
                        },
                        {
                            path: "login",
                            element: <Login />
                        },
                        {
                            path: "register",
                            element: <Register />
                        }
                    ]
                }
            ]
        },
        {
            path: "/",
            element: <MainProtected />,
            children: [
                {
                    path: "",
                    element: <MainLayout />,
                    children: [
                        {
                            path: "/home",
                            element: <Home />
                        },
                         {
                            path : "/add-job",
                            element : <AddJob />
                        },
                        {
                            path : "/applications",
                            element : <Applications />,
                        },
                        {
                            path : "/applications/:id",
                            element : <JobDetails />
                        },
                        {
                            path: "/notes",
                            element: <InterviewNotes />,
                        },
                        {
                            path: "/notes/:interviewId",
                            element: <InterviewExperienceCard />,
                        },
                        {
                            path: "*",
                            element: <Navigate to="/" replace />
                        }
                    ]
                }
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}

export default AppRoutes;
