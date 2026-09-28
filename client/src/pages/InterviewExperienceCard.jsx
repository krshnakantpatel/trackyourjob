import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuth } from "../hooks/authHooks";
import axiosInstance from "../utils/AxiosInstance";

const InterviewExperienceCard = () => {
    const { interviewId } = useParams();
    const {navigate} = useAuth();

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["interview-experience", interviewId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/interviews/${interviewId}`
            );

            return response.data.interview;
        },
    });

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (isLoading) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-10">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 w-24 rounded bg-slate-200" />
                    <div className="h-9 w-72 rounded bg-slate-200" />
                    <div className="h-48 rounded-3xl bg-slate-200" />
                </div>
            </main>
        );
    }

    if (isError || !data) {
        return (
            <main className="mx-auto max-w-4xl px-6 py-10">
                <button
                    onClick={() => navigate("/notes")}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-950"
                >
                    ← Back to interview experiences
                </button>

                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-900">
                        Interview experience not found
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        This interview may have been deleted or you may not
                        have access to it.
                    </p>
                </div>
            </main>
        );
    }

    const questions =
        data.questions?.filter((question) => question?.trim()) || [];

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">

            {/* BACK */}

            <button
                onClick={() => navigate("/notes")}
                className="text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
                ← Back to interview experiences
            </button>

            {/* HEADER */}

            <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {data.type}
                    </span>

                    {data.format && (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {data.format}
                        </span>
                    )}
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                    {data.job?.company || "Unknown company"}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    {data.job?.jobTitle || "Job application"}
                </p>
            </div>

            {/* INTERVIEW META */}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Interview date
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                        {formatDate(data.date)}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Time
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                        {data.time || "Not specified"}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Format
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                        {data.format || "Not specified"}
                    </p>
                </div>
            </div>

            {/* CONTENT */}

            <div className="mt-8 space-y-6">

                {/* QUESTIONS */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-bold text-slate-950">
                        Questions asked
                    </h2>

                    {questions.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            No questions were recorded.
                        </p>
                    ) : (
                        <ol className="mt-5 space-y-4">
                            {questions.map((question, index) => (
                                <li
                                    key={index}
                                    className="flex gap-4"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                        {index + 1}
                                    </span>

                                    <p className="pt-1 text-sm leading-6 text-slate-700">
                                        {question}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>

                {/* EXPERIENCE */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-bold text-slate-950">
                        Your experience
                    </h2>

                    {data.experience ? (
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                            {data.experience}
                        </p>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            No experience was recorded.
                        </p>
                    )}
                </section>

                {/* LEARNINGS */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-bold text-slate-950">
                        What I learned
                    </h2>

                    {data.learnings ? (
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                            {data.learnings}
                        </p>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            No learnings were recorded.
                        </p>
                    )}
                </section>

            </div>
        </main>
    );
};

export default InterviewExperienceCard;