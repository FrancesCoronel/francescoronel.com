import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

/**
 * Pagination buttons used across blog listing, category, and tag pages.
 * Hover inverts to the active style (navy bg + white text).
 */

const paginationButtonBase =
  "cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-all";
const paginationInactive =
  "border-horchata-200 text-navy-700 hover:border-horchata-500 hover:bg-horchata-500 hover:text-navy-900";
const paginationActive =
  "border-horchata-500 bg-horchata-500 text-navy-900";
const paginationDisabled =
  "border-horchata-200 text-navy-700 opacity-40 cursor-not-allowed";

function PaginationDemo({ totalPages: total }: { totalPages: number }) {
  const [page, setPage] = useState(1);

  const pages = Array.from({ length: total }, (_, i) => i + 1)
    .filter((p) => {
      if (p === 1 || p === total) return true;
      if (Math.abs(p - page) <= 2) return true;
      return false;
    })
    .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) {
        acc.push("ellipsis");
      }
      acc.push(p);
      return acc;
    }, []);

  return (
    <nav className="flex items-center justify-center gap-2">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`${paginationButtonBase} ${page === 1 ? paginationDisabled : paginationInactive}`}
      >
        Previous
      </button>

      {pages.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-navy-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => setPage(item)}
            className={`${paginationButtonBase} ${
              page === item ? paginationActive : paginationInactive
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => setPage(Math.min(total, page + 1))}
        disabled={page === total}
        className={`${paginationButtonBase} ${page === total ? paginationDisabled : paginationInactive}`}
      >
        Next
      </button>
    </nav>
  );
}

const meta: Meta = {
  title: "UI/Pagination",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

/** Interactive pagination with 10 pages — click around to see active + hover states */
export const Default: Story = {
  render: () => <PaginationDemo totalPages={10} />,
};

/** Few pages — Previous/Next are the main controls */
export const FewPages: Story = {
  render: () => <PaginationDemo totalPages={3} />,
};

/** Many pages — ellipsis appears between distant page numbers */
export const ManyPages: Story = {
  render: () => <PaginationDemo totalPages={37} />,
};

/** Single page — both Previous and Next are disabled */
export const SinglePage: Story = {
  render: () => (
    <nav className="flex items-center justify-center gap-2">
      <button disabled className={`${paginationButtonBase} ${paginationDisabled}`}>
        Previous
      </button>
      <button className={`${paginationButtonBase} ${paginationActive}`}>1</button>
      <button disabled className={`${paginationButtonBase} ${paginationDisabled}`}>
        Next
      </button>
    </nav>
  ),
};

/** All button states side by side */
export const ButtonStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-500">Inactive (default)</p>
        <button className={`${paginationButtonBase} ${paginationInactive}`}>3</button>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-500">Active (current page)</p>
        <button className={`${paginationButtonBase} ${paginationActive}`}>3</button>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-500">Disabled</p>
        <button disabled className={`${paginationButtonBase} ${paginationDisabled}`}>Previous</button>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-500">Hover (hover over me)</p>
        <button className={`${paginationButtonBase} ${paginationInactive}`}>Next</button>
      </div>
    </div>
  ),
};
