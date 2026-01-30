import AdminLayout from "../components/AdminLayout";

export default function AdminCourseEditorPage() {
  return (
    <AdminLayout title="Edit Courses">
      <div className="rounded border border-gray-200 p-4">
        <div className="mb-3 text-xs font-semibold">Content</div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-gray-600">Title (UA)</label>
            <input className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-600">Title (EN)</label>
            <input className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-xs" />
          </div>

          <div>
            <label className="text-[10px] text-gray-600">Short description (UA)</label>
            <input className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-600">Short description (EN)</label>
            <input className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-xs" />
          </div>

          <div className="col-span-2">
            <label className="text-[10px] text-gray-600">Full description (UA) (optional)</label>
            <textarea className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-xs" rows={3} />
          </div>

          <div className="col-span-2">
            <label className="text-[10px] text-gray-600">Full description (EN) (optional)</label>
            <textarea className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-xs" rows={3} />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded border border-gray-200 px-3 py-2 text-xs">Save draft</button>
          <button className="rounded bg-[#0E3B72] px-3 py-2 text-xs text-white">Publish</button>
          <a className="rounded border border-gray-200 px-3 py-2 text-xs" href="/admin/courses">
            Cancel
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}