import React from "react";
import { useState } from "react";
import { AppliedStage, OfferStage, TerminalStage } from "../hooks/jobHooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import { toast } from "react-toastify";
import { useParams } from "react-router";

import InterviewStage from "./InterviewStage";

const CurrentStage = ({
    job,
    setSelectedStatus,
    setShowStatusModal,
}) => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const [editingInterviewId, setEditingInterviewId] = useState(null);

    const [interviewData, setInterviewData] = useState({
        type: "Technical",
        date: "",
        time: "",
        format: "Video",
        questions: [""],
        experience: "",
        learnings: "",
    });

    const [editInterviewData, setEditInterviewData] = useState({
        type: "Technical",
        date: "",
        time: "",
        format: "Video",
        questions: [""],
        experience: "",
        learnings: "",
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
                questions: [""],
                experience: "",
                learnings: "",
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
    // UPDATE INTERVIEW
    // =========================================================

    const updateInterviewMutation = useMutation({
        mutationFn: async ({ interviewId, data }) => {
            const response = await axiosInstance.put(
                `/jobs/${id}/interviews/${interviewId}`,
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

            setEditingInterviewId(null);

            toast.success("Interview updated successfully");
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to update interview"
            );
        },
    });

    // =========================================================
    // DELETE INTERVIEW
    // =========================================================

    const deleteInterviewMutation = useMutation({
        mutationFn: async (interviewId) => {
            const response = await axiosInstance.delete(
                `/jobs/${id}/interviews/${interviewId}`
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

            toast.success("Interview deleted successfully");
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete interview"
            );
        },
    });

    // =========================================================
    // SUBMIT INTERVIEW
    // =========================================================

    const handleInterviewSubmit = (e) => {
        e.preventDefault();

        if (!interviewData.type || !interviewData.date) {
            toast.error("Interview type and date are required");
            return;
        }

        saveInterviewMutation.mutate(interviewData);
    };

    // =========================================================
    // START EDIT
    // =========================================================

    const startEditInterview = (interview) => {
        setEditingInterviewId(interview._id);

        setEditInterviewData({
            type: interview.type || "Technical",

            date: interview.date
                ? new Date(interview.date)
                    .toISOString()
                    .split("T")[0]
                : "",

            time: interview.time || "",

            format: interview.format || "Video",

            questions:
                Array.isArray(interview.questions) &&
                interview.questions.length > 0
                    ? interview.questions
                    : [""],

            experience: interview.experience || "",

            learnings: interview.learnings || "",
        });
    };

    // =========================================================
    // UPDATE INTERVIEW
    // =========================================================

    const handleInterviewUpdate = (e, interviewId) => {
        e.preventDefault();

        if (!editInterviewData.type || !editInterviewData.date) {
            toast.error("Interview type and date are required");
            return;
        }

        updateInterviewMutation.mutate({
            interviewId,
            data: editInterviewData,
        });
    };

    // =========================================================
    // DELETE INTERVIEW
    // =========================================================

    const handleDeleteInterview = (interviewId) => {
        if (
            window.confirm(
                "Delete this interview? This cannot be undone."
            )
        ) {
            deleteInterviewMutation.mutate(interviewId);
        }
    };

    return (
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

                    editingInterviewId={editingInterviewId}
                    editData={editInterviewData}
                    setEditData={setEditInterviewData}
                    onStartEdit={startEditInterview}
                    onCancelEdit={() =>
                        setEditingInterviewId(null)
                    }
                    onUpdate={handleInterviewUpdate}
                    onDelete={handleDeleteInterview}

                    isUpdating={updateInterviewMutation.isPending}
                    isDeleting={deleteInterviewMutation.isPending}
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
    );
};

export default CurrentStage;