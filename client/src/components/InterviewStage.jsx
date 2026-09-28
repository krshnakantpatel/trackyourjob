import React, { useEffect, useState } from "react";
import {
    FormSelect,
    EditInput,
    InterviewDetail,
} from "../hooks/jobHooks";

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

const InterviewStage = ({
    interviews,
    data,
    setData,
    onSubmit,
    isPending,
    editingInterviewId,
    editData,
    setEditData,
    onStartEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
    isUpdating,
    isDeleting,
}) => {
    const formatInterviewDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const [showForm, setShowForm] = useState(interviews.length === 0);

    useEffect(() => {
        if (interviews.length > 0) {
            setShowForm(false);
        }
    }, [interviews.length]);

    // =========================================================
    // QUESTION HELPERS
    // =========================================================

    const addQuestion = () => {
        setData((prev) => ({
            ...prev,
            questions: [...prev.questions, ""],
        }));
    };

    const removeQuestion = (index) => {
        setData((prev) => {
            // Always keep at least one input
            if (prev.questions.length === 1) {
                return {
                    ...prev,
                    questions: [""],
                };
            }

            return {
                ...prev,
                questions: prev.questions.filter(
                    (_, questionIndex) => questionIndex !== index
                ),
            };
        });
    };

    const updateQuestion = (index, value) => {
        setData((prev) => ({
            ...prev,
            questions: prev.questions.map((question, questionIndex) =>
                questionIndex === index ? value : question
            ),
        }));
    };

    // =========================================================
    // EDIT QUESTION HELPERS
    // =========================================================

    const addEditQuestion = () => {
        setEditData((prev) => ({
            ...prev,
            questions: [...prev.questions, ""],
        }));
    };

    const removeEditQuestion = (index) => {
        setEditData((prev) => {
            if (prev.questions.length === 1) {
                return {
                    ...prev,
                    questions: [""],
                };
            }

            return {
                ...prev,
                questions: prev.questions.filter(
                    (_, questionIndex) => questionIndex !== index
                ),
            };
        });
    };

    const updateEditQuestion = (index, value) => {
        setEditData((prev) => ({
            ...prev,
            questions: prev.questions.map((question, questionIndex) =>
                questionIndex === index ? value : question
            ),
        }));
    };

    return (
        <div>
            {/* =====================================================
                HEADER
            ===================================================== */}

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
                        className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        {showForm ? "Cancel" : "+ Add interview"}
                    </button>
                )}
            </div>

            {/* =====================================================
                INTERVIEW HISTORY
            ===================================================== */}

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
                            {/* =================================================
                                EDIT INTERVIEW
                            ================================================= */}

                            {editingInterviewId === interview._id ? (
                                <form
                                    onSubmit={(e) =>
                                        onUpdate(e, interview._id)
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-slate-900">
                                            Edit interview #{index + 1}
                                        </h4>
                                    </div>

                                    {/* BASIC DETAILS */}

                                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                        <FormSelect
                                            label="Interview type *"
                                            value={editData.type}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    type: e.target.value,
                                                }))
                                            }
                                            options={INTERVIEW_TYPES}
                                        />

                                        <EditInput
                                            label="Interview date *"
                                            type="date"
                                            value={editData.date}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    date: e.target.value,
                                                }))
                                            }
                                            required
                                        />

                                        <EditInput
                                            label="Time"
                                            type="time"
                                            value={editData.time}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    time: e.target.value,
                                                }))
                                            }
                                        />

                                        <FormSelect
                                            label="Format"
                                            value={editData.format}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    format: e.target.value,
                                                }))
                                            }
                                            options={INTERVIEW_FORMATS}
                                        />
                                    </div>

                                    {/* QUESTIONS */}

                                    <div className="mt-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700">
                                                    Questions asked
                                                </label>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Add the questions you remember
                                                    from the interview.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {editData.questions.map(
                                                (question, questionIndex) => (
                                                    <div
                                                        key={questionIndex}
                                                        className="flex gap-2"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={question}
                                                            onChange={(e) =>
                                                                updateEditQuestion(
                                                                    questionIndex,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={`Question ${
                                                                questionIndex + 1
                                                            }`}
                                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeEditQuestion(
                                                                    questionIndex
                                                                )
                                                            }
                                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            −
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addEditQuestion}
                                            className="mt-3 text-sm font-semibold text-slate-700 hover:text-slate-950"
                                        >
                                            + Add another question
                                        </button>
                                    </div>

                                    {/* EXPERIENCE */}

                                    <div className="mt-6">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Your experience
                                        </label>

                                        <textarea
                                            value={editData.experience}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    experience: e.target.value,
                                                }))
                                            }
                                            rows={5}
                                            placeholder="How did the interview go? What was the overall experience like?"
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                        />
                                    </div>

                                    {/* LEARNINGS */}

                                    <div className="mt-6">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            What did you learn?
                                        </label>

                                        <textarea
                                            value={editData.learnings}
                                            onChange={(e) =>
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    learnings: e.target.value,
                                                }))
                                            }
                                            rows={5}
                                            placeholder="What would you do differently or what did you learn from this interview?"
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                        />
                                    </div>

                                    {/* EDIT ACTIONS */}

                                    <div className="mt-6 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={onCancelEdit}
                                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                                        >
                                            {isUpdating
                                                ? "Saving..."
                                                : "Save changes"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* =================================================
                                   SAVED INTERVIEW
                                ================================================= */

                                <>
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
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

                                        <div className="flex items-center gap-2">
                                            {interview.format && (
                                                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                                    {interview.format}
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onStartEdit(interview)
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(interview._id)
                                                }
                                                disabled={isDeleting}
                                                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* INTERVIEW META */}

                                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                        <InterviewDetail
                                            label="Date"
                                            value={formatInterviewDate(
                                                interview.date
                                            )}
                                        />

                                        <InterviewDetail
                                            label="Time"
                                            value={
                                                interview.time ||
                                                "Not specified"
                                            }
                                        />

                                        <InterviewDetail
                                            label="Format"
                                            value={
                                                interview.format ||
                                                "Not specified"
                                            }
                                        />
                                    </div>

                                    {/* QUESTIONS */}

                                    {interview.questions?.some(
                                        (question) => question?.trim()
                                    ) && (
                                        <div className="mt-5 border-t border-slate-200 pt-5">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Questions asked
                                            </p>

                                            <ul className="mt-3 space-y-2">
                                                {interview.questions
                                                    .filter((question) =>
                                                        question?.trim()
                                                    )
                                                    .map(
                                                        (
                                                            question,
                                                            questionIndex
                                                        ) => (
                                                            <li
                                                                key={
                                                                    questionIndex
                                                                }
                                                                className="flex gap-3 text-sm leading-6 text-slate-600"
                                                            >
                                                                <span className="font-semibold text-slate-400">
                                                                    {questionIndex +
                                                                        1}
                                                                    .
                                                                </span>

                                                                <span>
                                                                    {question}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                            </ul>
                                        </div>
                                    )}

                                    {/* EXPERIENCE */}

                                    {interview.experience && (
                                        <div className="mt-5 border-t border-slate-200 pt-5">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Your experience
                                            </p>

                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                {interview.experience}
                                            </p>
                                        </div>
                                    )}

                                    {/* LEARNINGS */}

                                    {interview.learnings && (
                                        <div className="mt-5 border-t border-slate-200 pt-5">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                What I learned
                                            </p>

                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                {interview.learnings}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* =====================================================
                ADD INTERVIEW FORM
            ===================================================== */}

            {showForm && (
                <form
                    onSubmit={onSubmit}
                    className={`${
                        interviews.length > 0
                            ? "mt-6 border-t border-slate-100 pt-6"
                            : "mt-6"
                    }`}
                >
                    <h3 className="text-base font-semibold text-slate-900">
                        {interviews.length > 0
                            ? "Add another interview"
                            : "Add interview details"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Add the details of your upcoming or completed interview.
                    </p>

                    {/* BASIC DETAILS */}

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

                        <EditInput
                            label="Interview date *"
                            type="date"
                            value={data.date}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                }))
                            }
                            required
                        />

                        <EditInput
                            label="Time"
                            type="time"
                            value={data.time}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    time: e.target.value,
                                }))
                            }
                        />

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

                    {/* QUESTIONS */}

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-slate-700">
                            Questions asked
                        </label>

                        <p className="mt-1 text-xs text-slate-500">
                            Add the questions you remember from the interview.
                        </p>

                        <div className="mt-3 space-y-3">
                            {data.questions.map((question, questionIndex) => (
                                <div
                                    key={questionIndex}
                                    className="flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) =>
                                            updateQuestion(
                                                questionIndex,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Question ${
                                            questionIndex + 1
                                        }`}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeQuestion(questionIndex)
                                        }
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                    >
                                        −
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addQuestion}
                            className="mt-3 text-sm font-semibold text-slate-700 hover:text-slate-950"
                        >
                            + Add another question
                        </button>
                    </div>

                    {/* EXPERIENCE */}

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Your experience
                        </label>

                        <textarea
                            value={data.experience}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    experience: e.target.value,
                                }))
                            }
                            rows={5}
                            placeholder="How did the interview go? What was the overall experience like?"
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                    </div>

                    {/* LEARNINGS */}

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            What did you learn?
                        </label>

                        <textarea
                            value={data.learnings}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    learnings: e.target.value,
                                }))
                            }
                            rows={5}
                            placeholder="What would you do differently or what did you learn from this interview?"
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                    </div>

                    {/* SUBMIT */}

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl cursor-pointer bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {isPending
                                ? "Saving..."
                                : "Save interview"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default InterviewStage;