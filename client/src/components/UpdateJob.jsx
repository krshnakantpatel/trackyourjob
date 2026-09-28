import React from 'react';
import { FormSelect, EditInput } from '../hooks/jobHooks';

const UpdateJob = ({ 
    show, 
    onClose, 
    formData, 
    setFormData, 
    onSubmit, 
    updateJobMutation
}) => {
  return (
    <>
     {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
                    <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">Edit application</h2>
                                <p className="mt-1 text-sm text-slate-500">Update the job application details.</p>
                            </div>
                            <button type="button" onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                                ×
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="mt-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <EditInput label="Job title *" value={formData.jobTitle || ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, jobTitle: e.target.value }))} required />
                                <EditInput label="Company *" value={formData.company || ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))} required />
                                <EditInput label="Job URL" type="url" value={formData.jobUrl || ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, jobUrl: e.target.value }))} />
                                <EditInput label="Location" value={formData.location || ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
                                <FormSelect label="Job type" value={formData.jobType || "Full-time"}
                                    onChange={(e) => setFormData((p) => ({ ...p, jobType: e.target.value }))}
                                    options={["Full-time","Part-time","Contract","Internship","Freelance"]} />
                                <FormSelect label="Workplace" value={formData.workplaceType || "On-site"}
                                    onChange={(e) => setFormData((p) => ({ ...p, workplaceType: e.target.value }))} 
                                    options={["On-site","Hybrid","Remote"]} />
                                <EditInput label="Applied date" type="date" value={formData.appliedDate || ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, appliedDate: e.target.value }))} />
                                <FormSelect label="Source" value={formData.source || "Other"}
                                    onChange={(e) => setFormData((p) => ({ ...p, source: e.target.value }))}
                                    options={["LinkedIn","Company Site","Referral","Recruiter","Job Board","Other"]} />
                                <EditInput label="Minimum salary" type="number" value={formData.salaryMin ?? ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, salaryMin: e.target.value }))} />
                                <EditInput label="Maximum salary" type="number" value={formData.salaryMax ?? ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, salaryMax: e.target.value }))} />
                                <FormSelect label="Priority" value={formData.priority || "Medium"}
                                    onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
                                    options={["Low","Medium","High"]} />
                                {formData.source === "Referral" && (
                                    <EditInput label="Referral contact" value={formData.referralContact || ""}
                                        onChange={(e) => setFormData((p) => ({ ...p, referralContact: e.target.value }))} />
                                )}
                            </div>

                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Job description</label>
                                <textarea value={formData.jobDescription || ""}
                                    onChange={(e) => setFormData((p) => ({ ...p, jobDescription: e.target.value }))}
                                    rows={6}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => onClose()}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={updateJobMutation.isPending}
                                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                                    {updateJobMutation.isPending ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}   
    </>
  )
}

export default UpdateJob;