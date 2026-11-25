import type { ExpertiseId } from "@/lib/data/expertise"

export default function ExpertiseIcon({ discipline }: { discipline: ExpertiseId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.12"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {discipline === "software" && <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16" />}
      {discipline === "data" && (
        <>
          <path d="M4 4v16h16M7 15l4-5 3 2 5-6" />
          <circle cx="7" cy="15" r="1.4" />
          <circle cx="11" cy="10" r="1.4" />
          <circle cx="14" cy="12" r="1.4" />
          <circle cx="19" cy="6" r="1.4" />
        </>
      )}
      {discipline === "neuroscience" && (
        <>
          <path d="M12 6c-2-5-9-2-8 4-3 2-1 7 2 7-1 5 6 6 6 1V6Zm0 0c2-5 9-2 8 4 3 2 1 7-2 7 1 5-6 6-6 1" />
          <path d="M8 8c3 0 2 3 4 3m4-3c-3 0-2 3-4 3M8 15c3 0 2-3 4-3m4 3c-3 0-2-3-4-3" />
        </>
      )}
    </svg>
  )
}
