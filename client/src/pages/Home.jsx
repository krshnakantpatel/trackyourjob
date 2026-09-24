import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/authHooks";

const Home = () => {
    const { navigate } = useAuth();
    const { user } = useSelector((state) => state.auth);

    const [filter, setFilter] = useState("All");

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            const response = await axiosInstance.get("/jobs");
            return response.data.jobs;
        },
    });

    const allApplications = data || [];

    const applications = allApplications.slice(0, 10);

    const totalApps = allApplications.length;

    const interviewCount = allApplications.filter(
        (app) => app.status === "Interview"
    ).length;

    const offerCount = allApplications.filter(
        (app) => app.status === "Offer"
    ).length;

    const rejectedCount = allApplications.filter(
        (app) => app.status === "Rejected"
    ).length;

    const filteredApps =
        filter === "All"
            ? applications
            : applications.filter((app) => app.status === filter);

    // ================= LOADING STATE =================

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900">

                {/* Loading Hero */}
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                        <div className="max-w-3xl animate-pulse">
                            <div className="h-4 w-32 rounded bg-slate-200" />

                            <div className="mt-5 h-12 w-3/4 rounded-lg bg-slate-200" />

                            <div className="mt-3 h-12 w-1/2 rounded-lg bg-slate-200" />

                            <div className="mt-6 h-5 w-full max-w-2xl rounded bg-slate-200" />
                            <div className="mt-2 h-5 w-2/3 max-w-2xl rounded bg-slate-200" />

                            <div className="mt-8 h-11 w-40 rounded-xl bg-slate-200" />
                        </div>
                    </div>
                </section>

                {/* Loading Dashboard */}
                <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <div className="animate-pulse">
                        <div className="h-7 w-40 rounded bg-slate-200" />
                        <div className="mt-2 h-4 w-64 rounded bg-slate-200" />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">

                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="h-4 w-32 rounded bg-slate-200" />
                                        <div className="mt-4 h-9 w-12 rounded bg-slate-200" />
                                    </div>

                                    <div className="h-10 w-10 rounded-xl bg-slate-200" />
                                </div>

                                <div className="mt-4 h-3 w-40 rounded bg-slate-200" />
                            </div>
                        ))}

                    </div>

                    {/* Applications Skeleton */}
                    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div className="animate-pulse">
                                <div className="h-5 w-36 rounded bg-slate-200" />
                                <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
                            </div>

                            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
                        </div>

                        <div className="divide-y divide-slate-100">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-4 px-6 py-5"
                                >
                                    <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

                                    <div className="flex-1 animate-pulse">
                                        <div className="h-4 w-56 rounded bg-slate-200" />
                                        <div className="mt-2 h-3 w-72 rounded bg-slate-200" />
                                        <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
                                    </div>

                                    <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />
                                    <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
                                </div>
                            ))}
                        </div>

                    </div>

                </main>
            </div>
        );
    }

    // ================= ERROR STATE =================

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900">

                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                        <div className="max-w-2xl">

                            <p className="mb-4 text-sm font-semibold text-red-600">
                                Something went wrong
                            </p>

                            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                                We couldn't load your applications.
                            </h1>

                            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                                There was a problem while fetching your job
                                applications. Please try again.
                            </p>

                            <button
                                onClick={() => window.location.reload()}
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Try again
                            </button>

                        </div>

                    </div>
                </section>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ================= HERO ================= */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="max-w-3xl">

                        <p className="mb-4 text-sm font-semibold text-blue-600">
                            Welcome back, {user?.name || "there"}
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Manage your job search
                            <span className="block text-blue-600">
                                in one place.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Track your applications, interviews, offers and
                            rejections without losing track of where you applied.
                        </p>

                        <button
                            onClick={() => navigate("/add-job")}
                            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>

                            Add application
                        </button>

                    </div>
                </div>
            </section>

            {/* ================= DASHBOARD ================= */}

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                {/* Header */}

                <div className="mb-7">
                    <h2 className="text-2xl font-bold text-slate-950">
                        Applications
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Your job application overview.
                    </p>
                </div>

                {/* ================= STATS ================= */}

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                    {/* Total Applications */}

                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-sm">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total applications
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                                    {totalApps}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>

                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            All applications you've added
                        </p>
                    </div>


                    {/* Interviews */}

                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-sm">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Interviews
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                                    {interviewCount}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m4 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7h16zM4 11h16"
                                    />
                                </svg>
                            </div>

                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            Applications in interview stage
                        </p>
                    </div>


                    {/* Offers */}

                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-sm">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Offers
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                                    {offerCount}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M12 3v18m0-18c-2.5 0-4 1.2-4 3s1.5 3 4 3 4 1.2 4 3-1.5 3-4 3-4 1.2-4 3 1.5 3 4 3m0-18c2.5 0 4 1.2 4 3"
                                    />
                                </svg>
                            </div>

                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            Applications with an offer
                        </p>
                    </div>


                    {/* Rejected */}

                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-red-200 hover:shadow-sm">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Rejected
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                                    {rejectedCount}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M6 6l12 12M18 6L6 18"
                                    />
                                </svg>
                            </div>

                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            Applications that didn't move forward
                        </p>
                    </div>

                </div>

                {/* ================= APPLICATIONS ================= */}

                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                    {/* Header */}

                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-950">
                                Recent applications
                            </h2>
                        </div>

                        {/* Filters */}

                        {applications.length > 0 && (
                            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">

                                {["All", "Interview", "Offer", "Rejected"].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            onClick={() => setFilter(item)}
                                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                                                filter === item
                                                    ? "bg-white text-slate-900 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-900"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}

                            </div>
                        )}

                    </div>


                    {/* ================= APPLICATION LIST ================= */}

                    {filteredApps.length > 0 && (
                        <div className="divide-y divide-slate-100">

                            {filteredApps.map((job) => (
                                <button
                                    key={job._id}
                                    onClick={() => navigate(`/applications/${job._id}`)}
                                    className="group flex w-full cursor-pointer items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50"
                                >

                                    {/* Company Avatar */}

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                                        {job.company?.charAt(0)?.toUpperCase()}
                                    </div>


                                    {/* Job Information */}

                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-center gap-2">

                                            <h4 className="truncate text-sm font-semibold text-slate-950">
                                                {job.jobTitle}
                                            </h4>

                                            <span className="hidden text-slate-300 sm:block">
                                                •
                                            </span>

                                            <span className="hidden truncate text-sm text-slate-500 sm:block">
                                                {job.company}
                                            </span>

                                        </div>


                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">

                                            {job.location && (
                                                <>
                                                    <span>{job.location}</span>

                                                    <span className="text-slate-300">
                                                        •
                                                    </span>
                                                </>
                                            )}

                                            <span>{job.jobType}</span>

                                            <span className="text-slate-300">
                                                •
                                            </span>

                                            <span>{job.workplaceType}</span>

                                        </div>


                                        <p className="mt-1.5 text-xs text-slate-400">
                                            Applied{" "}
                                            {job.appliedDate
                                                ? new Date(
                                                      job.appliedDate
                                                  ).toLocaleDateString(
                                                      "en-IN",
                                                      {
                                                          day: "2-digit",
                                                          month: "short",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "—"}
                                        </p>

                                    </div>


                                    {/* Status */}

                                    <div className="shrink-0">

                                        <span
                                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                job.status === "Applied"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : job.status === "Interview"
                                                    ? "bg-violet-50 text-violet-700"
                                                    : job.status === "Offer"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : job.status === "Rejected"
                                                    ? "bg-red-50 text-red-700"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {job.status}
                                        </span>

                                    </div>


                                    {/* Arrow */}

                                    <div className="shrink-0">

                                        <svg
                                            className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>

                                    </div>

                                </button>
                            ))}

                            <button
                                onClick={() => navigate("/applications")}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-b-2xl bg-slate-50 px-6 py-3 text-md font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                View all applications

                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>

                            </button>

                        </div>
                    )}

                    {/* ================= EMPTY STATE ================= */}

                    {filteredApps.length === 0 && (
                        <div className="px-6 py-20 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                                <svg
                                    className="h-8 w-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M20 7l-8 5-8-5m16 0a2 2 0 00-2-2H6a2 2 0 00-2 2m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7"
                                    />
                                </svg>

                            </div>


                            <h3 className="mt-5 text-lg font-semibold text-slate-950">
                                {filter === "All"
                                    ? "No applications yet"
                                    : `No ${filter.toLowerCase()} applications`}
                            </h3>


                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                {filter === "All"
                                    ? "Start tracking your job search by adding your first application."
                                    : `You don't have any ${filter.toLowerCase()} applications yet.`}
                            </p>


                            {filter === "All" && (
                                <button
                                    onClick={() => navigate("/add-job")}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >

                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>

                                    Add your first application

                                </button>
                            )}

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
};

export default Home;