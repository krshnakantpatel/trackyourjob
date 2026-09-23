import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import { useAuth } from "../hooks/authHooks";
import { toast } from "react-toastify";

const AddJob = () => {
    const {navigate} =  useAuth();
    const [formData, setFormData] = useState({
        jobTitle: "",
        jobUrl: "",
        jobDescription: "",
        company: "",
        location: "",
        jobType: "Full-time",
        workplaceType: "On-site",
    });

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

            setFormData({
                jobTitle: "",
                jobUrl: "",
                jobDescription: "",
                company: "",
                location: "",
                jobType: "Full-time",
                workplaceType: "On-site",
            });
            navigate("/");
        },

        onError: (error) => {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Failed to add job"
            );
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        addJobMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-6">
                    Add Job
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Job Title */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Job Title *
                        </label>

                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                            required
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Company *
                        </label>

                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Amazon"
                            required
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Bangalore"
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Job Type + Workplace Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Job Type */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Job Type *
                            </label>

                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-2 bg-white"
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

                        {/* Workplace Type */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Workplace Type *
                            </label>

                            <select
                                name="workplaceType"
                                value={formData.workplaceType}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-2 bg-white"
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

                    {/* Job URL */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Job URL
                        </label>

                        <input
                            type="url"
                            name="jobUrl"
                            value={formData.jobUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Job Description */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Job Description
                        </label>

                        <textarea
                            name="jobDescription"
                            value={formData.jobDescription}
                            onChange={handleChange}
                            placeholder="Paste the job description here..."
                            rows={7}
                            className="w-full border rounded-lg px-4 py-2 resize-none"
                        />
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