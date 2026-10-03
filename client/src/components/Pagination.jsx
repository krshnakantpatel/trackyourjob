import React from "react";

const Pagination = ({
    page,
    totalPages,
    onPageChange,
    isFetching = false,
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const getPages = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (page > 3) {
            pages.push("...");
        }

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="mt-6 flex items-center justify-between gap-4">
            <button
                type="button"
                disabled={page === 1 || isFetching}
                onClick={() => onPageChange(page - 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                ← Previous
            </button>

            <div className="flex items-center gap-1">
                {getPages().map((item, index) =>
                    item === "..." ? (
                        <span
                            key={`dots-${index}`}
                            className="px-2 text-sm text-slate-400"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            disabled={isFetching}
                            onClick={() => onPageChange(item)}
                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                                page === item
                                    ? "bg-slate-950 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {item}
                        </button>
                    )
                )}
            </div>

            <button
                type="button"
                disabled={page === totalPages || isFetching}
                onClick={() => onPageChange(page + 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next →
            </button>
        </div>
    );
};

export default Pagination;