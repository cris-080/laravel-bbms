import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ schedules }) {
    const updateStatus = (schedule, status) => {
        router.patch(
            `/schedules/${schedule.id}/status`,
            { status },
            {
                preserveScroll: true,
            }
        );
    };

    const statusClass = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-700';

            case 'Completed':
                return 'bg-green-100 text-green-700';

            case 'Cancelled':
                return 'bg-red-100 text-red-700';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout title="Donation Schedules">
            <Head title="Donation Schedules" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Donation Schedules
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage blood donation appointments and appointment status.
                        </p>
                    </div>

                    <Link
                        href="/schedules/create"
                        className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        + New Schedule
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Donor
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Blood Group
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Time
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {schedules.data.length > 0 ? (
                                    schedules.data.map((schedule) => (
                                        <tr key={schedule.id}>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {schedule.donor?.name || 'Unknown Donor'}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                                    {schedule.donor?.blood_group || '—'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {schedule.appointment_date}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {schedule.appointment_time}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                                        schedule.status
                                                    )}`}
                                                >
                                                    {schedule.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {schedule.status === 'Scheduled' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    schedule,
                                                                    'Completed'
                                                                )
                                                            }
                                                            className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                                                        >
                                                            Complete
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    schedule,
                                                                    'Cancelled'
                                                                )
                                                            }
                                                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        No actions
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No donation schedules found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {schedules.links && (
                        <div className="flex flex-wrap gap-2 border-t p-4">
                            {schedules.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-lg px-3 py-2 text-sm ${
                                        link.active
                                            ? 'bg-red-600 text-white'
                                            : 'border bg-white text-gray-600'
                                    } ${
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}