import React, { useEffect, useState } from "react";
import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../utils/AxiosInstance";
import { toast } from "react-toastify";

// components
import JobHeader from "../components/JobHeader";
import ApplicationJourney from "../components/ApplicationJourney";
import InterviewStage from "../components/InterviewStage";
import CurrentStage from "../components/CurrentStage";
import UpdateJob from "../components/UpdateJob";
import { Detail } from "../hooks/jobHooks";

const STATUS_OPTIONS = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
];

const INTERVIEW_TYPES = [
    "Initial screen",
    "Technical",
    "Work culture",
    "Panel",
    "Other",
];

const INTERVIEW_FORMATS = [
    "Video",
    "Phone",
    "In-person",
    "Other",
];

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const [statusNotes, setStatusNotes] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // =========================================================
    // FETCH JOB
    // =========================================================

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

    // =========================================================
    // KEEP SELECTED STATUS IN SYNC
    // =========================================================

    useEffect(() => {
        if (job) {
            setSelectedStatus(job.status);
        }
    }, [job]);

    // =========================================================
    // UPDATE BASIC JOB
    // =========================================================

    const updateJobMutation = useMutation({
        mutationFn: async (updatedData) => {
            const response = await axiosInstance.put(
                `/jobs/${id}`,
                updatedData
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
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to update application"
            );
        },
    });

    // =========================================================
    // DELETE JOB
    // =========================================================

    const deleteJobMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(`/jobs/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["job", id] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            toast.success("Application deleted successfully");
            navigate("/applications");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete application");
        },
    });

    // =========================================================
    // CHANGE STATUS
    // =========================================================

    const changeStatusMutation = useMutation({
        mutationFn: async ({ status, notes }) => {
            const response = await axiosInstance.patch(
                `/jobs/${id}/status`,
                {
                    status,
                    notes,
                }
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

            setShowStatusModal(false);
            setStatusNotes("");

            toast.success(
                `Application moved to ${updatedJob.status}`
            );
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to update status"
            );
        },
    });

    // =========================================================
    // HELPERS
    // =========================================================

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleStatusChange = () => {
        if (!selectedStatus) return;

        changeStatusMutation.mutate({
            status: selectedStatus,
            notes: statusNotes,
        });
    };

    const openEditModal = () => {
        setEditFormData({
            jobTitle: job.jobTitle || "",
            company: job.company || "",
            jobUrl: job.jobUrl || "",
            location: job.location || "",
            jobType: job.jobType || "Full-time",
            workplaceType: job.workplaceType || "On-site",
            jobDescription: job.jobDescription || "",
            appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split("T")[0] : "",
            source: job.source || "Other",
            salaryMin: job.salaryMin ?? "",
            salaryMax: job.salaryMax ?? "",
            priority: job.priority || "Medium",
            referralContact: job.referralContact || "",
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateJobMutation.mutate({
            ...editFormData,
            salaryMin: editFormData.salaryMin === "" ? undefined : Number(editFormData.salaryMin),
            salaryMax: editFormData.salaryMax === "" ? undefined : Number(editFormData.salaryMax),
            appliedDate: editFormData.appliedDate ? new Date(editFormData.appliedDate) : undefined,
            referralContact: editFormData.source === "Referral" ? editFormData.referralContact : "",
        }, {
            onSuccess: (updatedJob) => {
                queryClient.setQueryData(["job", id], updatedJob);
                setShowEditModal(false);
                toast.success("Application updated successfully");
            }
        });
    };

    const handleDeleteJob = () => {
        if (window.confirm(`Delete "${job.jobTitle}" at ${job.company}? This cannot be undone.`)) {
            deleteJobMutation.mutate();
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">

                    <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />

                    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
                        <div className="flex gap-4">
                            <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-200" />

                            <div>
                                <div className="h-7 w-64 animate-pulse rounded bg-slate-200" />
                                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-slate-100" />
                            </div>
                        </div>

                        <div className="mt-10 h-24 animate-pulse rounded-2xl bg-slate-100" />
                    </div>

                    <div className="mt-6 h-64 animate-pulse rounded-3xl bg-white" />
                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (isError || !job) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        !
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-slate-900">
                        Application not found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        This application doesn't exist or you don't have
                        access to it.
                    </p>

                    <button
                        onClick={() => navigate("/applications")}
                        className="mt-6 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Back to applications
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* ================================================= */}
                {/* BACK */}
                {/* ================================================= */}

                <button
                    onClick={() => navigate(-1)}
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

                {/* ================================================= */}
                {/* JOB HEADER */}
                {/* ================================================= */}

               <JobHeader
                    job={job}
                    onEdit={openEditModal}
                    onDelete={handleDeleteJob}
                    isDeleting={deleteJobMutation.isPending}
                />

                {/* ================================================= */}
                {/* APPLICATION JOURNEY */}
                {/* ================================================= */}

                <ApplicationJourney
                    job={job}
                    setSelectedStatus={setSelectedStatus}
                    setShowStatusModal={setShowStatusModal}
                />

                {/* ================================================= */}
                {/* CURRENT STAGE */}
                {/* ================================================= */}

                <CurrentStage
                    job={job}
                    setSelectedStatus={setSelectedStatus}
                    setShowStatusModal={setShowStatusModal}
                />
    
                {/* ================================================= */}
                {/* JOB INFORMATION */}
                {/* ================================================= */}

                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Job information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Details about this opportunity.
                            </p>
                        </div>
                    </div>

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
                            value={job.location}
                        />

                        <Detail
                            label="Applied"
                            value={formatDate(job.appliedDate)}
                        />

                        <Detail
                            label="Source"
                            value={job.source}
                        />

                        <Detail
                            label="Priority"
                            value={job.priority}
                        />

                        <Detail
                            label="Referral"
                            value={job.referralContact}
                        />

                        <Detail
                            label="Last updated"
                            value={formatDate(job.updatedAt)}
                        />
                    </div>
                </section>

                {/* ================================================= */}
                {/* SALARY */}
                {/* ================================================= */}

                {(job.salaryMin || job.salaryMax) && (
                    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-base font-semibold text-slate-900">
                            Salary range
                        </h2>

                        <p className="mt-3 text-lg font-semibold text-slate-800">
                            {job.salaryMin?.toLocaleString()}{" "}
                            {job.salaryMax &&
                                `– ${job.salaryMax.toLocaleString()}`}{" "}
                            <span className="text-sm font-medium text-slate-400">
                                {job.salaryCurrency || "INR"}
                            </span>
                        </p>
                    </section>
                )}

                {/* ================================================= */}
                {/* DESCRIPTION */}
                {/* ================================================= */}

                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

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

                {/* ================================================= */}
                {/* JOB LINK */}
                {/* ================================================= */}

                {job.jobUrl && (
                    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-base font-semibold text-slate-900">
                            Original job posting
                        </h2>

                        <a
                            href={job.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950"
                        >
                            Open job posting

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

            </div>

            {/* ===================================================== */}
            {/* UPDATE JOB MODAL */}
            {/* ===================================================== */}

                <UpdateJob
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    formData={editFormData}
                    setFormData={setEditFormData}
                    onSubmit={handleEditSubmit}
                    updateJobMutation={updateJobMutation}
                />
            
            {/* ===================================================== */}
            {/* STATUS MODAL */}
            {/* ===================================================== */}

            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">
                                    Change application status
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update the current stage of this application.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-6 space-y-2">
                            {STATUS_OPTIONS.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`
                                        flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition
                                        ${
                                            selectedStatus === status
                                                ? "border-slate-950 bg-slate-950 text-white"
                                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    {status}

                                    {selectedStatus === status && (
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
                                                d="m5 12 4 4L19 6"
                                            />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>

                        {(selectedStatus === "Rejected" ||
                            selectedStatus === "Withdrawn") && (
                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Notes
                                </label>

                                <textarea
                                    value={statusNotes}
                                    onChange={(e) =>
                                        setStatusNotes(e.target.value)
                                    }
                                    rows={4}
                                    placeholder="Optional notes..."
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                                />
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="rounded-xl cursor-pointer border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleStatusChange}
                                disabled={
                                    changeStatusMutation.isPending ||
                                    selectedStatus === job.status
                                }
                                className="rounded-xl cursor-pointer bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {changeStatusMutation.isPending
                                    ? "Updating..."
                                    : "Update status"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;