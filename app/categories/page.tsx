import { createClient } from "@/lib/supabase/server";
import Nav from "@/app/components/Nav";
import CategoryAddForm from "@/app/components/CategoryAddForm";
import CategoryRow from "@/app/components/CategoryRow";
import { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("name");

  const rows = (categories ?? []) as Category[];

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
            Failed to load categories: {error.message}
          </div>
        )}

        <CategoryAddForm />

        {rows.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-300 rounded-lg">
            No categories yet — add your first one above.
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">LHDN Code</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((c) => (
                  <CategoryRow key={c.id} category={c} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
