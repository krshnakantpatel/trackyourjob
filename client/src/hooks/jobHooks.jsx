import React from "react";


export const AppliedStage = ({ job, onChangeStatus }) => {
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


export const InterviewDetail = ({ label, value }) => {
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

export const OfferStage = () => {
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


export const TerminalStage = ({ title, description }) => {
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

export const Detail = ({ label, value }) => {
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


export const EditInput = ({
    label,
    type = "text",
    value,
    onChange,
    required = false,
}) => (
    <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
        <input type={type} value={value} onChange={onChange} required={required}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-slate-400 focus:bg-white" />
    </div>
);

export const FormSelect = ({
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