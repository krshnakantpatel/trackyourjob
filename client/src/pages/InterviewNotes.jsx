import React , {useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/authHooks";
import axiosInstance from "../utils/AxiosInstance";
import Pagination from "../components/Pagination";

const InterviewNotes = () => {
    const {navigate} = useAuth();
    const [page, setPage] = useState(1);
    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ["interview-experiences", page],

        queryFn: async () => {
            const response = await axiosInstance.get("/interviews", {
                params: {
                    page,
                    limit: 15,
                },
            });

            return response.data;
        },

        placeholderData: (previousData) => previousData,
    });

    const interviews = data?.interviews || [];

    const formatDate = (date) => {
        if (!date) return "Date not specified";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (isLoading) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-10">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-56 rounded-lg bg-slate-200" />
                    <div className="h-4 w-80 rounded bg-slate-200" />

                    <div className="mt-8 grid gap-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-36 rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-10">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-900">
                        Failed to load interview experiences
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        Please try again later.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">

            {/* HEADER */}

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                    Interview experiences
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Review the interviews you've recorded and what you learned
                    from them.
                </p>
            </div>

            {/* EMPTY STATE */}

            {interviews.length === 0 ? (
                <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                        📝
                    </div>

                    <h2 className="mt-4 font-semibold text-slate-900">
                        No interview experiences yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Once you complete an interview, you can save the
                        questions, your experience, and what you learned here.
                    </p>

                    <button
                        onClick={() => navigate("/applications")}
                        className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        View applications
                    </button>
                </div>
            ) : (
                /* EXPERIENCE LIST */

                <div className="mt-8 space-y-4">
                    {interviews.map((interview) => (
                        <button
                            key={interview._id}
                            type="button"
                            onClick={() =>
                                navigate(`/notes/${interview._id}`)
                            }
                            className="group cursor-pointer w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md"
                        >
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                                {/* COMPANY */}

                                <div>
                                    <h2 className="text-base font-semibold text-slate-950">
                                        {interview.job?.company ||
                                            "Unknown company"}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {interview.job?.jobTitle ||
                                            "Job application"}
                                    </p>
                                </div>

                                {/* META */}

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                        {interview.type}
                                    </span>

                                    {interview.format && (
                                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                            {interview.format}
                                        </span>
                                    )}

                                    <span className="text-xs text-slate-400">
                                        {formatDate(interview.date)}
                                    </span>
                                </div>
                            </div>

                            {/* PREVIEW */}

                            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Questions
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {interview.questions?.filter(
                                            (question) => question?.trim()
                                        ).length || 0}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Experience
                                    </p>

                                    <p className="mt-1 truncate text-sm text-slate-600">
                                        {interview.experience ||
                                            "Not added"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Learnings
                                    </p>

                                    <p className="mt-1 truncate text-sm text-slate-600">
                                        {interview.learnings ||
                                            "Not added"}
                                    </p>
                                </div>

                            </div>

                            <div className="mt-4 text-right text-xs font-semibold text-slate-400 transition group-hover:text-slate-700">
                                View experience →
                            </div>
                        </button>
                    ))}
                    {/* Pagination */}
                    <Pagination
                        page={data?.pagination?.page || 1}
                        totalPages={data?.pagination?.totalPages || 1}
                        onPageChange={setPage}
                        isFetching={isFetching}
                    />
                </div>
            )}
        </main>
    );
};

export default InterviewNotes;