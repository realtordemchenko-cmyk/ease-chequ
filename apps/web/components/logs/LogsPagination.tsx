// apps/web/components/logs/LogsPagination.tsx
"use client";

interface LogsPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

export default function LogsPagination({
    currentPage,
    totalPages,
    setCurrentPage,
}: LogsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}