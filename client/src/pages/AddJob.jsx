import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import { useAuth } from "../hooks/authHooks";
import { toast } from "react-toastify";

const initialFormData = {
    jobTitle: "",
    company: "",
    jobUrl: "",
    location: "",
    jobType: "Full-time",
    workplaceType: "On-site",
    jobDescription: "",
    appliedDate: new Date().toISOString().split("T")[0],
    source: "Other",
    salaryMin: "",
    salaryMax: "",
    priority: "Medium",
    referralContact: "",
};

const AddJob = () => {
    const { navigate } = useAuth();

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addJobMutation = useMutation({
        mutationFn: async (jobData) => {
            const response = await axiosInstance.post("/jobs", jobData);
            return response.data;
        },

        onSuccess: () => {
            toast.success("Application added successfully");

            setFormData(initialFormData);

            navigate("/");
        },

        onError: (error) => {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to add application"
            );
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,

            // Convert salary strings to numbers
            salaryMin:
                formData.salaryMin === ""
                    ? undefined
                    : Number(formData.salaryMin),

            salaryMax:
                formData.salaryMax === ""
                    ? undefined
                    : Number(formData.salaryMax),
        };

        addJobMutation.mutate(payload);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">

                {/* Back button */}
                <button
                    type="button"
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

                {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Add application
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Add the details of a job application you're tracking.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ================= JOB INFORMATION ================= */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">
                            Job information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Basic information about the position.
                        </p>

                        <div className="mt-5 space-y-5">

                            {/* Job Title */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Job title *
                                </label>

                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer"
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            {/* Company */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Company *
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="e.g. Amazon"
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            {/* Job URL + Location */}
                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Job URL
                                    </label>

                                    <input
                                        type="url"
                                        name="jobUrl"
                                        value={formData.jobUrl}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Bangalore"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>

                            </div>

                            {/* Job Type + Workplace */}
                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Job type *
                                    </label>

                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        required
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    >
                                        <option value="Full-time">
                                            Full-time
                                        </option>
                                        <option value="Part-time">
                                            Part-time
                                        </option>
                                        <option value="Contract">
                                            Contract
                                        </option>
                                        <option value="Internship">
                                            Internship
                                        </option>
                                        <option value="Freelance">
                                            Freelance
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Workplace *
                                    </label>

                                    <select
                                        name="workplaceType"
                                        value={formData.workplaceType}
                                        onChange={handleChange}
                                        required
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    >
                                        <option value="On-site">
                                            On-site
                                        </option>
                                        <option value="Hybrid">
                                            Hybrid
                                        </option>
                                        <option value="Remote">
                                            Remote
                                        </option>
                                    </select>
                                </div>

                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Job description
                                </label>

                                <textarea
                                    name="jobDescription"
                                    value={formData.jobDescription}
                                    onChange={handleChange}
                                    placeholder="Paste the job description here..."
                                    rows={7}
                                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                        </div>
                    </section>

                    {/* ================= APPLICATION INFORMATION ================= */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">
                            Application details
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Information about how and when you applied.
                        </p>

                        <div className="mt-5 space-y-5">

                            {/* Applied Date */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Applied date *
                                </label>

                                <input
                                    type="date"
                                    name="appliedDate"
                                    value={formData.appliedDate}
                                    onChange={handleChange}
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            {/* Source */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Application source
                                </label>

                                <select
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                >
                                    <option value="LinkedIn">
                                        LinkedIn
                                    </option>
                                    <option value="Company Site">
                                        Company Site
                                    </option>
                                    <option value="Referral">
                                        Referral
                                    </option>
                                    <option value="Recruiter">
                                        Recruiter
                                    </option>
                                    <option value="Job Board">
                                        Job Board
                                    </option>
                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* Referral Contact */}
                            {formData.source === "Referral" && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Referral contact
                                    </label>

                                    <input
                                        type="text"
                                        name="referralContact"
                                        value={formData.referralContact}
                                        onChange={handleChange}
                                        placeholder="e.g. Rahul Sharma"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                    />
                                </div>
                            )}

                        </div>
                    </section>

                    {/* ================= SALARY ================= */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">
                            Salary
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Add the salary range if it is mentioned in the
                            job posting.
                        </p>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">

                            {/* Minimum Salary */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Minimum salary
                                </label>

                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g. 600000"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            {/* Maximum Salary */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Maximum salary
                                </label>

                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g. 1000000"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                        </div>
                    </section>

                    {/* ================= PRIORITY ================= */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-900">
                            Priority
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            How important is this opportunity to you?
                        </p>

                        <div className="mt-4 grid grid-cols-3 gap-3">

                            {["Low", "Medium", "High"].map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            priority,
                                        }))
                                    }
                                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                        formData.priority === priority
                                            ? "border-slate-950 bg-slate-950 text-white"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {priority}
                                </button>
                            ))}

                        </div>
                    </section>

                    {/* ================= ACTIONS ================= */}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={addJobMutation.isPending}
                            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {addJobMutation.isPending
                                ? "Adding application..."
                                : "Add application"}
                        </button>

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={addJobMutation.isPending}
                        className="w-full cursor-pointer bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50"
                    >
                        {addJobMutation.isPending
                            ? "Adding Job..."
                            : "Add Job"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddJob;