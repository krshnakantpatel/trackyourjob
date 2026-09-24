import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../utils/AxiosInstance";
import { toast } from "react-toastify";

const STATUS_STEPS = ["Applied", "Interview", "Offer"];

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

    const [interviewData, setInterviewData] = useState({
        type: "Technical",
        date: "",
        time: "",
        format: "Video",
        notes: "",
    });

    const [statusNotes, setStatusNotes] = useState("");

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
    // SAVE INTERVIEW
    // =========================================================

    const saveInterviewMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post(
                `/jobs/${id}/interviews`,
                data
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

            toast.success("Interview details saved");

            setInterviewData({
                type: "Technical",
                date: "",
                time: "",
                format: "Video",
                notes: "",
            });
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to save interview"
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

    const getInitial = () => {
        return job?.company?.charAt(0)?.toUpperCase() || "?";
    };

    const getStepState = (step) => {
        if (!job) return "future";

        const currentIndex = STATUS_STEPS.indexOf(job.status);
        const stepIndex = STATUS_STEPS.indexOf(step);

        if (job.status === "Rejected" || job.status === "Withdrawn") {
            return "future";
        }

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";

        return "future";
    };

    const handleStatusChange = () => {
        if (!selectedStatus) return;

        changeStatusMutation.mutate({
            status: selectedStatus,
            notes: statusNotes,
        });
    };

    const handleInterviewSubmit = (e) => {
        e.preventDefault();

        if (!interviewData.type || !interviewData.date) {
            toast.error("Interview type and date are required");
            return;
        }

        saveInterviewMutation.mutate(interviewData);
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
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
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

                    Back to applications
                </button>

                {/* ================================================= */}
                {/* JOB HEADER */}
                {/* ================================================= */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">

                        <div className="flex min-w-0 gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-700">
                                {getInitial()}
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-bold tracking-tight text-slate-950">
                                    {job.jobTitle}
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    {job.company}
                                    {job.location && ` · ${job.location}`}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {job.jobType}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {job.workplaceType}
                                    </span>

                                    {job.priority && (
                                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                            {job.priority} priority
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                // For now, keep this for basic job editing.
                                // We can build the edit modal separately.
                            }}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Edit job
                        </button>
                    </div>
                </section>

                {/* ================================================= */}
                {/* APPLICATION JOURNEY */}
                {/* ================================================= */}

                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Application journey
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Track your progress through the hiring process.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedStatus(job.status);
                                setShowStatusModal(true);
                            }}
                            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Change status
                        </button>
                    </div>

                    {/* Journey */}
                    <div className="mt-10 overflow-x-auto pb-2">
                        <div className="mx-auto flex min-w-[620px] items-start justify-center">

                            {STATUS_STEPS.map((step, index) => {
                                const state = getStepState(step);

                                return (
                                    <React.Fragment key={step}>

                                        <div className="flex w-36 flex-col items-center text-center">

                                            <div
                                                className={`
                                                    flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition
                                                    ${
                                                        state === "completed"
                                                            ? "border-emerald-500 bg-emerald-500 text-white"
                                                            : state === "current"
                                                            ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-200"
                                                            : "border-slate-200 bg-white text-slate-400"
                                                    }
                                                `}
                                            >
                                                {state === "completed" ? (
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
                                                            d="m5 12 4 4L19 6"
                                                        />
                                                    </svg>
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>

                                            <p
                                                className={`
                                                    mt-3 text-sm font-semibold
                                                    ${
                                                        state === "future"
                                                            ? "text-slate-400"
                                                            : "text-slate-900"
                                                    }
                                                `}
                                            >
                                                {step}
                                            </p>

                                            {state === "current" && (
                                                <span className="mt-1 text-xs font-medium text-slate-400">
                                                    Current stage
                                                </span>
                                            )}
                                        </div>

                                        {index < STATUS_STEPS.length - 1 && (
                                            <div
                                                className={`
                                                    mt-5 h-0.5 min-w-24 flex-1
                                                    ${
                                                        getStepState(
                                                            STATUS_STEPS[index + 1]
                                                        ) === "completed" ||
                                                        getStepState(
                                                            STATUS_STEPS[index + 1]
                                                        ) === "current"
                                                            ? "bg-emerald-400"
                                                            : "bg-slate-200"
                                                    }
                                                `}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rejected / Withdrawn */}
                    {(job.status === "Rejected" ||
                        job.status === "Withdrawn") && (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-800">
                                Application {job.status.toLowerCase()}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                This application is no longer progressing
                                through the hiring process.
                            </p>
                        </div>
                    )}
                </section>

                {/* ================================================= */}
                {/* CURRENT STAGE */}
                {/* ================================================= */}

                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    {job.status === "Applied" && (
                        <AppliedStage
                            job={job}
                            onChangeStatus={() => {
                                setSelectedStatus("Interview");
                                setShowStatusModal(true);
                            }}
                        />
                    )}

                    {job.status === "Interview" && (
                        <InterviewStage
                            interviews={job.interviews || []}
                            data={interviewData}
                            setData={setInterviewData}
                            onSubmit={handleInterviewSubmit}
                            isPending={saveInterviewMutation.isPending}
                        />
                    )}

                    {job.status === "Offer" && (
                        <OfferStage />
                    )}

                    {job.status === "Rejected" && (
                        <TerminalStage
                            title="Application rejected"
                            description="This application has reached the end of the hiring process."
                        />
                    )}

                    {job.status === "Withdrawn" && (
                        <TerminalStage
                            title="Application withdrawn"
                            description="You withdrew this application from the hiring process."
                        />
                    )}
                </section>

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
                                        flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition
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
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleStatusChange}
                                disabled={
                                    changeStatusMutation.isPending ||
                                    selectedStatus === job.status
                                }
                                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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


/* ============================================================= */
/* STAGE COMPONENTS                                               */
/* ============================================================= */

const AppliedStage = ({ job, onChangeStatus }) => {
    return (
        <div>
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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
                            d="m5 12 4 4L19 6"
                        />
                    </svg>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-slate-950">
                        Application submitted
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        You applied to {job.company} on{" "}
                        {new Date(job.appliedDate).toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}
                        .
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
                <button
                    onClick={onChangeStatus}
                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Move to interview
                </button>
            </div>
        </div>
    );
};


const InterviewStage = ({
    interviews,
    data,
    setData,
    onSubmit,
    isPending,
}) => {
    const [showForm, setShowForm] = useState(interviews.length === 0);

    return (
        <div>
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-950">
                        Interview stage
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Keep track of all interviews for this application.
                    </p>
                </div>

                {interviews.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowForm((prev) => !prev)}
                        className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        {showForm ? "Cancel" : "+ Add interview"}
                    </button>
                )}
            </div>

            {/* EXISTING INTERVIEWS */}
            {interviews.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                        Interview history
                    </h3>

                    {interviews.map((interview, index) => (
                        <div
                            key={interview._id || index}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                        >
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                                            {index + 1}
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-slate-900">
                                                {interview.type}
                                            </h4>

                                            <p className="text-xs text-slate-500">
                                                Interview #{index + 1}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {interview.format && (
                                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                        {interview.format}
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <InterviewDetail
                                    label="Date"
                                    value={formatInterviewDate(interview.date)}
                                />

                                <InterviewDetail
                                    label="Time"
                                    value={interview.time || "Not specified"}
                                />

                                <InterviewDetail
                                    label="Format"
                                    value={interview.format || "Not specified"}
                                />
                            </div>

                            {interview.notes && (
                                <div className="mt-5 border-t border-slate-200 pt-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Notes
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                        {interview.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ADD INTERVIEW FORM */}
            {showForm && (
                <form
                    onSubmit={onSubmit}
                    className={`${interviews.length > 0 ? "mt-6 border-t border-slate-100 pt-6" : "mt-6"}`}
                >
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            {interviews.length > 0
                                ? "Add another interview"
                                : "Add interview details"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Add the details of your upcoming or completed interview.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <FormSelect
                            label="Interview type *"
                            value={data.type}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                }))
                            }
                            options={INTERVIEW_TYPES}
                        />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Interview date *
                            </label>

                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        date: e.target.value,
                                    }))
                                }
                                required
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Time
                            </label>

                            <input
                                type="time"
                                value={data.time}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        time: e.target.value,
                                    }))
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                            />
                        </div>

                        <FormSelect
                            label="Format"
                            value={data.format}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    format: e.target.value,
                                }))
                            }
                            options={INTERVIEW_FORMATS}
                        />
                    </div>

                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Notes
                        </label>

                        <textarea
                            value={data.notes}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    notes: e.target.value,
                                }))
                            }
                            rows={4}
                            placeholder="Add anything you want to remember..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                        />
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Save interview"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

const formatInterviewDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const InterviewDetail = ({ label, value }) => {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1.5 text-sm font-semibold text-slate-800">
                {value || "Not specified"}
            </p>
        </div>
    );
};

const OfferStage = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-6">

            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-100">
                    <svg
                        className="h-6 w-6"
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
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-950">
                        Offer received 🎉
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                        Congratulations! You've reached the offer stage.
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Notes
                </label>

                <textarea
                    rows={5}
                    placeholder="Add notes about the offer..."
                    className="w-full resize-none rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-300"
                />
            </div>
        </div>
    );
};


const TerminalStage = ({ title, description }) => {
    return (
        <div>
            <h2 className="text-lg font-bold text-slate-950">
                {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                {description}
            </p>
        </div>
    );
};


/* ============================================================= */
/* SMALL COMPONENTS                                               */
/* ============================================================= */

const Detail = ({ label, value }) => {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1.5 text-sm font-semibold text-slate-800">
                {value || "Not specified"}
            </p>
        </div>
    );
};


const FormSelect = ({
    label,
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
                value={value}
                onChange={onChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
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

export default JobDetails;