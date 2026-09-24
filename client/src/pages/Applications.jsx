import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axiosInstance from "../utils/AxiosInstance";

const Applications = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [jobTypeFilter, setJobTypeFilter] = useState("All");
    const [workplaceFilter, setWorkplaceFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");

    const {
        data: jobs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            const response = await axiosInstance.get("/jobs");
            return response.data.jobs;
        },
    });

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        // Search
        const searchTerm = search.trim().toLowerCase();

        if (searchTerm) {
            result = result.filter((job) => {
                return (
                    job.jobTitle?.toLowerCase().includes(searchTerm) ||
                    job.company?.toLowerCase().includes(searchTerm) ||
                    job.location?.toLowerCase().includes(searchTerm)
                );
            });
        }

        // Status
        if (statusFilter !== "All") {
            result = result.filter(
                (job) => job.status === statusFilter
            );
        }

        // Job type
        if (jobTypeFilter !== "All") {
            result = result.filter(
                (job) => job.jobType === jobTypeFilter
            );
        }

        // Workplace
        if (workplaceFilter !== "All") {
            result = result.filter(
                (job) => job.workplaceType === workplaceFilter
            );
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.appliedDate || a.createdAt);
            const dateB = new Date(b.appliedDate || b.createdAt);

            return sortOrder === "newest"
                ? dateB - dateA
                : dateA - dateB;
        });

        return result;
    }, [
        jobs,
        search,
        statusFilter,
        jobTypeFilter,
        workplaceFilter,
        sortOrder,
    ]);

    const getStatusStyles = (status) => {
        switch (status) {
            case "Interview":
                return "bg-blue-50 text-blue-700 border-blue-100";

            case "Offer":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";

            case "Rejected":
                return "bg-red-50 text-red-700 border-red-100";

            case "Withdrawn":
                return "bg-slate-100 text-slate-600 border-slate-200";

            default:
                return "bg-amber-50 text-amber-700 border-amber-100";
        }
    };

    const getInitial = (company) => {
        return company?.charAt(0)?.toUpperCase() || "?";
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setJobTypeFilter("All");
        setWorkplaceFilter("All");
        setSortOrder("newest");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* Header skeleton */}
                    <div className="mb-8">
                        <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
                        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-200" />
                    </div>

                    {/* Search skeleton */}
                    <div className="mb-6 h-12 animate-pulse rounded-xl bg-slate-200" />

                    {/* Jobs skeleton */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
                            >
                                <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

                                <div className="flex-1">
                                    <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
                                    <div className="mt-2 h-3 w-72 animate-pulse rounded bg-slate-100" />
                                </div>

                                <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                            <svg
                                className="h-6 w-6 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M12 9v3.5m0 3.5h.01M10.3 4.2l-7.1 12.3A2 2 0 005 19.5h14a2 2 0 001.8-3L13.7 4.2a2 2 0 00-3.4 0z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            Failed to load applications
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Something went wrong while fetching your jobs.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Saved Applications
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Track and manage all your job applications.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/add-job")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
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
                                d="M12 5v14M5 12h14"
                            />
                        </svg>

                        Add application
                    </button>
                </div>

                {/* Search + Filters */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row">

                        {/* Search */}
                        <div className="relative flex-1">
                            <svg
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                />
                            </svg>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search jobs, companies, locations..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        {/* Status */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="All">All statuses</option>
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                        </select>

                        {/* Job type */}
                        <select
                            value={jobTypeFilter}
                            onChange={(e) => setJobTypeFilter(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="All">All job types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                        </select>

                        {/* Workplace */}
                        <select
                            value={workplaceFilter}
                            onChange={(e) => setWorkplaceFilter(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="All">All workplaces</option>
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </div>
                </div>

                {/* Results header */}
                <div className="mb-3 flex items-center justify-between px-1">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            All applications
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Showing {filteredJobs.length} of {jobs.length} applications
                        </p>
                    </div>

                    {(search ||
                        statusFilter !== "All" ||
                        jobTypeFilter !== "All" ||
                        workplaceFilter !== "All" ||
                        sortOrder !== "newest") && (
                        <button
                            onClick={clearFilters}
                            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Applications */}
                {filteredJobs.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {filteredJobs.map((job) => (
                            <button
                                key={job._id}
                                onClick={() => navigate(`/applications/${job._id}`)}
                                className="group flex w-full items-center gap-4 border-b border-slate-100 px-5 py-5 text-left transition last:border-b-0 hover:bg-slate-50 sm:px-6"
                            >
                                {/* Company avatar */}
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 transition group-hover:bg-slate-200">
                                    {getInitial(job.company)}
                                </div>

                                {/* Main content */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                                        <h3 className="truncate text-sm font-semibold text-slate-900">
                                            {job.jobTitle}
                                        </h3>

                                        <span className="hidden text-slate-300 sm:inline">
                                            ·
                                        </span>

                                        <span className="truncate text-sm text-slate-500">
                                            {job.company}
                                        </span>
                                    </div>

                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                                        {job.location && (
                                            <>
                                                <span>{job.location}</span>
                                                <span>·</span>
                                            </>
                                        )}

                                        {job.jobType && (
                                            <>
                                                <span>{job.jobType}</span>
                                                <span>·</span>
                                            </>
                                        )}

                                        {job.workplaceType && (
                                            <span>{job.workplaceType}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Applied date */}
                                <div className="hidden shrink-0 text-right md:block">
                                    <p className="text-xs text-slate-400">
                                        Applied
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        {formatDate(job.appliedDate)}
                                    </p>
                                </div>

                                {/* Status */}
                                <span
                                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                                        job.status
                                    )}`}
                                >
                                    {job.status}
                                </span>

                                {/* Arrow */}
                                <svg
                                    className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="m9 5 7 7-7 7"
                                    />
                                </svg>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                            <svg
                                className="h-6 w-6 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M21 13.5V7a2 2 0 00-2-2h-5.5L11 2.5H5a2 2 0 00-2 2v14a2 2 0 002 2h7"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="m16 16 2 2 4-4"
                                />
                            </svg>
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-slate-900">
                            {jobs.length === 0
                                ? "No applications yet"
                                : "No applications found"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                            {jobs.length === 0
                                ? "Start tracking your job applications to see them here."
                                : "Try changing your search or filters to find what you're looking for."}
                        </p>

                        {jobs.length === 0 ? (
                            <button
                                onClick={() => navigate("/add-job")}
                                className="mt-6 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Add your first application
                            </button>
                        ) : (
                            <button
                                onClick={clearFilters}
                                className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;