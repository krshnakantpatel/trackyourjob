import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../utils/AxiosInstance";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        jobTitle: "",
        company: "",
        jobUrl: "",
        location: "",
        jobDescription: "",
        jobType: "Full-time",
        workplaceType: "On-site",
        status: "Applied",
        appliedDate: "",
    });

    // Fetch job
    const {
        data: job,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["job", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/jobs/${id}`);
            return response.data.job;
        },
    });

    // Put job data into form
    useEffect(() => {
        if (job) {
            setFormData({
                jobTitle: job.jobTitle || "",
                company: job.company || "",
                jobUrl: job.jobUrl || "",
                location: job.location || "",
                jobDescription: job.jobDescription || "",
                jobType: job.jobType || "Full-time",
                workplaceType: job.workplaceType || "On-site",
                status: job.status || "Applied",
                appliedDate: job.appliedDate
                    ? new Date(job.appliedDate)
                          .toISOString()
                          .split("T")[0]
                    : "",
            });
        }
    }, [job]);

    // Update job
    const updateJobMutation = useMutation({
        mutationFn: async (updatedJob) => {
            const response = await axiosInstance.put(
                `/jobs/${id}`,
                updatedJob
            );

            return response.data.job;
        },

        onSuccess: (updatedJob) => {
            queryClient.setQueryData(
                ["job", id],
                updatedJob
            );

            queryClient.invalidateQueries({
                queryKey: ["jobs"],
            });

            setIsEditing(false);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        updateJobMutation.mutate(formData);
    };

    const handleCancel = () => {
        if (job) {
            setFormData({
                jobTitle: job.jobTitle || "",
                company: job.company || "",
                jobUrl: job.jobUrl || "",
                location: job.location || "",
                jobDescription: job.jobDescription || "",
                jobType: job.jobType || "Full-time",
                workplaceType: job.workplaceType || "On-site",
                status: job.status || "Applied",
                appliedDate: job.appliedDate
                    ? new Date(job.appliedDate)
                          .toISOString()
                          .split("T")[0]
                    : "",
            });
        }

        setIsEditing(false);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-40 animate-pulse rounded bg-slate-100" />

                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item}>
                                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                                    <div className="mt-2 h-5 w-40 animate-pulse rounded bg-slate-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Job not found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            This application doesn't exist or you don't have
                            access to it.
                        </p>

                        <button
                            onClick={() => navigate("/jobs")}
                            className="mt-6 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Back to jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Back */}
                <button
                    onClick={() => navigate("-1")}
                    className="mb-6 cursor-pointer flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
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
                            strokeWidth="1.8"
                            d="m15 19-7-7 7-7"
                        />
                    </svg>

                    Back 
                </button>

                {/* Header */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-700">
                                {job.company?.charAt(0)?.toUpperCase()}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-950">
                                    {job.jobTitle}
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    {job.company}
                                    {job.location && ` · ${job.location}`}
                                </p>

                                <div className="mt-3">
                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                                            job.status
                                        )}`}
                                    >
                                        {job.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
                                        strokeWidth="1.8"
                                        d="m16.5 3.5 4 4M4 20l3.5-.8L19.5 7.2a2.1 2.1 0 000-3l-.7-.7a2.1 2.1 0 00-3 0L3.8 15.5 3 19.5z"
                                    />
                                </svg>

                                Edit application
                            </button>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    /* ================= EDIT FORM ================= */
                    <form onSubmit={handleSave}>
                        <div className="space-y-6">

                            {/* Basic information */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Job information
                                </h2>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                                    <FormInput
                                        label="Job title"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        required
                                    />

                                    <FormInput
                                        label="Company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                    />

                                    <FormInput
                                        label="Job URL"
                                        name="jobUrl"
                                        value={formData.jobUrl}
                                        onChange={handleChange}
                                    />

                                    <FormInput
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />

                                    <FormSelect
                                        label="Job type"
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        options={[
                                            "Full-time",
                                            "Part-time",
                                            "Contract",
                                            "Internship",
                                            "Freelance",
                                        ]}
                                    />

                                    <FormSelect
                                        label="Workplace"
                                        name="workplaceType"
                                        value={formData.workplaceType}
                                        onChange={handleChange}
                                        options={[
                                            "On-site",
                                            "Hybrid",
                                            "Remote",
                                        ]}
                                    />

                                    <FormSelect
                                        label="Application status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        options={[
                                            "Applied",
                                            "Interview",
                                            "Offer",
                                            "Rejected",
                                            "Withdrawn",
                                        ]}
                                    />

                                    <FormInput
                                        label="Applied date"
                                        type="date"
                                        name="appliedDate"
                                        value={formData.appliedDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </section>

                            {/* Description */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Job description
                                </h2>

                                <textarea
                                    name="jobDescription"
                                    value={formData.jobDescription}
                                    onChange={handleChange}
                                    rows={8}
                                    placeholder="Add the job description..."
                                    className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </section>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={updateJobMutation.isPending}
                                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {updateJobMutation.isPending
                                        ? "Saving..."
                                        : "Save changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* ================= VIEW MODE ================= */
                    <div className="space-y-6">

                        {/* Job details */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900">
                                Job details
                            </h2>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <Detail
                                    label="Job type"
                                    value={job.jobType}
                                />

                                <Detail
                                    label="Workplace"
                                    value={job.workplaceType}
                                />

                                <Detail
                                    label="Location"
                                    value={job.location || "Not specified"}
                                />

                                <Detail
                                    label="Applied"
                                    value={formatDate(job.appliedDate)}
                                />
                            </div>
                        </section>

                        {/* Description */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900">
                                Job description
                            </h2>

                            {job.jobDescription ? (
                                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                    {job.jobDescription}
                                </p>
                            ) : (
                                <p className="mt-4 text-sm text-slate-400">
                                    No job description added.
                                </p>
                            )}
                        </section>

                        {/* Job link */}
                        {job.jobUrl && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Job posting
                                </h2>

                                <a
                                    href={job.jobUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-950"
                                >
                                    Open original job posting

                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.8"
                                            d="M14 5h5v5M19 5l-8 8"
                                        />
                                    </svg>
                                </a>
                            </section>
                        )}

                        {/* Application metadata */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900">
                                Application information
                            </h2>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                <Detail
                                    label="Applied date"
                                    value={formatDate(job.appliedDate)}
                                />

                                <Detail
                                    label="Last updated"
                                    value={formatDate(job.updatedAt)}
                                />
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};


/* ================= REUSABLE COMPONENTS ================= */

const FormInput = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
}) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
        </div>
    );
};

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options,
}) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

const Detail = ({ label, value }) => {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1.5 text-sm font-medium text-slate-800">
                {value || "Not specified"}
            </p>
        </div>
    );
};

export default JobDetails;