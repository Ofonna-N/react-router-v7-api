/**
 * Members list page.
 * Uses Orval-generated useGetMembers() hook.
 */
import { useGetMembers } from "../api/generated/members/members";
import type { GetMembers200DataItem } from "../api/generated/schemas";

export default function MembersPage() {
  const { data, isLoading, isError, error } = useGetMembers();

  // Runtime: data = { data: Member[] } (raw JSON body from GET /members)
  const members = (data as unknown as { data: GetMembers200DataItem[] })?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Members</h1>

      {isLoading && <p className="text-gray-500">Loading members...</p>}

      {isError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          Failed to load members:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {!isLoading && !isError && members.length === 0 && (
        <p className="text-gray-500">No members found.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-3"
          >
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{member.name}</p>
              <p className="text-sm text-gray-500 truncate">{member.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
