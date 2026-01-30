import AdminLayout from "../components/AdminLayout";

export default function AdminCoursesPage() {
  return (
    <AdminLayout title="Courses">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input className="rounded border border-gray-200 px-3 py-2 text-xs" placeholder="Search..." />
          <select className="rounded border border-gray-200 px-3 py-2 text-xs">
            <option>Status</option>
          </select>
          <select className="rounded border border-gray-200 px-3 py-2 text-xs">
            <option>Tags</option>
          </select>
        </div>

        <a
          className="rounded bg-[#0E3B72] px-3 py-2 text-xs text-white"
          href="/admin/courses/editor"
        >
          Add course
        </a>
      </div>

      <div className="overflow-hidden rounded border border-gray-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Lang</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Duration</th>
              <th className="px-3 py-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {["Digital Marketing Basics", "Web Development 101", "Project Management Pro"].map((t) => (
              <tr key={t} className="border-t">
                <td className="px-3 py-2">{t}</td>
                <td className="px-3 py-2">UA/EN</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}