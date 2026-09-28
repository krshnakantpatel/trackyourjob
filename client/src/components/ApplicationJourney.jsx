import React from 'react'

const ApplicationJourney = ({
    job,
    setSelectedStatus,
    setShowStatusModal,
}) => {

    const STATUS_STEPS = ["Applied", "Interview", "Offer"];

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


  return (
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
                className="cursor-pointer rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
  )
}

export default ApplicationJourney;