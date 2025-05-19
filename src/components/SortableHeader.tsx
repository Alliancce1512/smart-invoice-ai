
import React from "react";
import { TableHead } from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  children,
  sortKey,
  currentSortColumn,
  sortDirection,
  onSort,
  className
}) => {
  const isActive = currentSortColumn === sortKey;
  
  return (
    <TableHead
      className={cn(
        "cursor-pointer select-none",
        isActive && "text-primary font-medium",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1 justify-between">
        <span>{children}</span>
        {isActive && (
          <span className="inline-flex items-center">
            {sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
    </TableHead>
  );
};

export default SortableHeader;
