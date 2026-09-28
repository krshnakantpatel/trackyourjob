import React from 'react'

const JobHeader = ({job ,onEdit, onDelete, isDeleting}) => {

    const getInitial = () => {
        return job?.company?.charAt(0)?.toUpperCase() || "?";
    };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">

            <div className="flex min-w-0 gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-700">
                    {getInitial()}
                </div>

                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold tracking-tight text-slate-950">
                        {job.jobTitle}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {job.company}
                        {job.location && ` · ${job.location}`}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {job.jobType}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {job.workplaceType}
                        </span>

                        {job.priority && (
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                {job.priority} priority
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={onEdit}
                    className="rounded-xl cursor-pointer border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Edit
                </button>
                <button type="button" onClick={onDelete} disabled={isDeleting}
                    className="rounded-xl cursor-pointer border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50">
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    </section>
  )
}

export default JobHeader;