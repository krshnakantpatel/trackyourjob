import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { addUser, removeUser, setWaitTime, setAttemptsLeft } from "../features/AuthSlice";
import api from "../utils/AxiosInstance";

const useAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [remainingAttempts, setRemainingAttempts] = useState(null);
    const [lockoutSeconds, setLockoutSeconds] = useState(0);

    const SESSION_DURATION = 24 * 60 * 60 * 1000;

    const setSessionExpiry = () => {
        localStorage.setItem(
            "authExpiresAt",
            String(Date.now() + SESSION_DURATION)
        );
    };

    // Timer effect for rate limiting countdown
    useEffect(() => {
        const calculateSecondsLeft = () => {
            const lockoutUntil = localStorage.getItem("authLockoutUntil");
            if (!lockoutUntil) return 0;
            const diff = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
            return diff > 0 ? diff : 0;
        };

        const initialLeft = calculateSecondsLeft();
        setLockoutSeconds(initialLeft);

        if (initialLeft <= 0) {
            localStorage.removeItem("authLockoutUntil");
            return;
        }

        const interval = setInterval(() => {
            const left = calculateSecondsLeft();
            setLockoutSeconds(left);
            if (left <= 0) {
                localStorage.removeItem("authLockoutUntil");
                setRemainingAttempts(null);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkSessionExpiry = () => {
            const expiresAt = localStorage.getItem("authExpiresAt");

            if (!expiresAt) return;

            const remainingTime = Number(expiresAt) - Date.now();

            if (remainingTime <= 0) {
                dispatch(removeUser());
                localStorage.removeItem("authExpiresAt");
                navigate("/login");
                return;
            }

            const timer = setTimeout(() => {
                dispatch(removeUser());
                localStorage.removeItem("authExpiresAt");
                toast.info("Your session has expired. Please login again.");
                navigate("/login");
            }, remainingTime);

            return () => clearTimeout(timer);
        };

        return checkSessionExpiry();
    }, [dispatch, navigate]);

    const processAuthHeadersOrError = (error) => {
        if (!error) return;

        // Extract remaining attempts header
        const remainingHeader =
            error.response?.headers?.["ratelimit-remaining"] ??
            error.response?.headers?.["x-ratelimit-remaining"] ??
            error.response?.data?.remaining;

        if (remainingHeader !== undefined && remainingHeader !== null) {
            const rem = parseInt(remainingHeader, 10);
            if (!isNaN(rem)) {
                setRemainingAttempts(rem);
            }
        }

        // Handle 429 Too Many Requests
        if (error.response?.status === 429) {
            const retryAfter =
                error.response?.data?.retryAfter ||
                parseInt(error.response?.headers?.["retry-after"], 10) ||
                120;
            
            const lockoutUntil = Date.now() + retryAfter * 1000;
            localStorage.setItem("authLockoutUntil", String(lockoutUntil));
            setLockoutSeconds(retryAfter);
            setRemainingAttempts(0);
        }
    };

    // Login Mutation
    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post("/auth/login", {
                email: credentials.email,
                password: credentials.password,
            });
            return response;
        },
        onSuccess: (response) => {
            const { user, token, message } = response.data;
            dispatch(addUser({ user, token }));
            setSessionExpiry();
            toast.success(message || "User logged in successfully");
            setRemainingAttempts(null);
            localStorage.removeItem("authLockoutUntil");
            dispatch(setWaitTime(0));
            dispatch(setAttemptsLeft(5));
            reset();
            navigate("/home");
        },
        onError: (error) => {
            processAuthHeadersOrError(error);
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
        },
    });

    // Register Mutation
    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const response = await api.post("/auth/register", {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            });
            return response;
        },
        onSuccess: (response) => {
            const { user, token, message } = response.data;
            dispatch(addUser({ user, token }));
            setSessionExpiry();
            toast.success(message || "User registered successfully");
            setRemainingAttempts(null);
            localStorage.removeItem("authLockoutUntil");
            dispatch(setWaitTime(0));
            dispatch(setAttemptsLeft(5));
            reset();
            navigate("/home");
        },
        onError: (error) => {
            processAuthHeadersOrError(error);
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
        },
    });

    const loginForm = (data) => {
        if (lockoutSeconds > 0) return;
        loginMutation.mutate(data);
    };

    const registerForm = (data) => {
        if (lockoutSeconds > 0) return;
        registerMutation.mutate(data);
    };

    const logoutUser = () => {
        dispatch(removeUser());
        localStorage.removeItem("authExpiresAt");

        toast.info("Logged out successfully");
        navigate("/login");
    };

    const isLockedOut = lockoutSeconds > 0;

    return {
        navigate,
        register,
        handleSubmit,
        reset,
        errors,
        loading: loginMutation.isPending || registerMutation.isPending,
        isPending: loginMutation.isPending || registerMutation.isPending,
        loginMutation,
        registerMutation,
        registerForm,
        loginForm,
        logoutUser,
        remainingAttempts,
        lockoutSeconds,
        isLockedOut,
    };
};

export {
    useAuth
};


