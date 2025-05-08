"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  return (
    <Pagination className="mt-8 flex justify-center">
      <PaginationContent>
        {/* Previous arrow */}
        <PaginationItem>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="hover:text-gray-500"
          >
            <RiArrowDropLeftFill className="h-9 w-9" />
          </button>
        </PaginationItem>

        {/* First page */}
        <PaginationItem>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => onPageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {/* Early pages dropdown */}
        {currentPage > 3 && (
          <PaginationItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center">
                <PaginationEllipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-24 overflow-y-scroll">
                {Array.from({ length: currentPage - 2 }, (_, i) => i + 2).map(
                  (page) => (
                    <DropdownMenuItem
                      key={page}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </PaginationItem>
        )}

        {/* Surrounding pages */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage !== 1 && currentPage !== totalPages && (
          <PaginationItem>
            <PaginationLink isActive={true}>{currentPage}</PaginationLink>
          </PaginationItem>
        )}

        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Later pages dropdown */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center">
                <PaginationEllipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-24 overflow-y-scroll">
                {Array.from(
                  { length: totalPages - currentPage - 1 },
                  (_, i) => currentPage + i + 2
                ).map((page) => (
                  <DropdownMenuItem key={page} onClick={() => onPageChange(page)}>
                    {page}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </PaginationItem>
        )}

        {/* Last page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next arrow */}
        <PaginationItem>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="hover:text-gray-500"
          >
            <RiArrowDropRightFill className="h-9 w-9" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
