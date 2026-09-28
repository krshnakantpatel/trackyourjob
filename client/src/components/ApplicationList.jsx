import React from 'react';
import {useAuth} from '../hooks/authHooks';

const ApplicationList = ({ filteredApps }) => {
    const { navigate } = useAuth();   
  return (
    <>
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
    </>
  )
}

export default ApplicationList;