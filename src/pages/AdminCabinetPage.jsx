import AdminLayout from "../components/AdminLayout";

export default function AdminCabinetPage() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs font-semibold">User Activity</div>
          <div className="mt-3 h-24 rounded bg-gray-100" />
        </div>
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs font-semibold">Active Users</div>
          <div className="mt-3 h-24 rounded bg-gray-100" />
        </div>
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs font-semibold">New Courses</div>
          <div className="mt-3 h-24 rounded bg-gray-100" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs font-semibold">Recent Activity</div>
          <div className="mt-3 h-28 rounded bg-gray-100" />
        </div>
        <div className="rounded border border-gray-200 p-4">
          <div className="text-xs font-semibold">Notes</div>
          <div className="mt-3 h-28 rounded bg-gray-100" />
        </div>
      </div>
    </AdminLayout>
  );
}