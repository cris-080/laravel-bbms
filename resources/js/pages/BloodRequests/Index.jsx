import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ requests }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        released_to: '',
    });

    const openApproveModal = (request) => {
        setSelectedRequest(request);
        setShowApproveModal(true);
        reset();
    };

    const closeApproveModal = () => {
        setSelectedRequest(null);
        setShowApproveModal(false);
        reset();
    };

    const approveRequest = (e) => {
        e.preventDefault();

        if (!selectedRequest) return;

        post(`/blood-requests/${selectedRequest.id}/approve`, {
            preserveScroll: true,
            onSuccess: () => {
                closeApproveModal();
            },
        });
    };

    const rejectRequest = (request) => {
        if (
            confirm(
                `Are you sure you want to reject the blood request for ${request.patient_name}?`
            )
        ) {
            router.post(
                `/blood-requests/${request.id}/reject`,
                {},
                {
                    preserveScroll: true,
                }
            );
        }
    };

    const statusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-100 text-amber-700';

            case 'Handed Over':
                return 'bg-green-100 text-green-700';

            case 'Approved':
                return 'bg-blue-100 text-blue-700';

            case 'Rejected':
                return 'bg-red-100 text-red-700';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout title="Blood Requests">
            <Head title="Blood Requests" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Blood Requests
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage blood requests, approvals, releases, and rejections.
                        </p>
                    </div>

                    <Link
                        href="/blood-requests/create"
                        className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        + New Blood Request
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Patient
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Physician
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Blood Group
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Units
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Reference
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {requests.data.length > 0 ? (
                                    requests.data.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {request.patient_name}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {request.request_date || ''}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {request.physician_name}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                                    {request.blood_group}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                {request.units_needed}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                                        request.status
                                                    )}`}
                                                >
                                                    {request.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {request.reference_code || '—'}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {request.status === 'Pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openApproveModal(
                                                                    request
                                                                )
                                                            }
                                                            className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                rejectRequest(
                                                                    request
                                                                )
                                                            }
                                                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        Completed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No blood requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {requests.links && (
                        <div className="flex flex-wrap gap-2 border-t p-4">
                            {requests.links.map((link, index) => (
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

            {showApproveModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-gray-900">
                            Approve Blood Request
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Releasing {selectedRequest.units_needed} unit(s) of{' '}
                            {selectedRequest.blood_group} blood for{' '}
                            {selectedRequest.patient_name}.
                        </p>

                        <form
                            onSubmit={approveRequest}
                            className="mt-5 space-y-4"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Released To
                                </label>

                                <input
                                    type="text"
                                    value={data.released_to}
                                    onChange={(e) =>
                                        setData(
                                            'released_to',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Name of recipient"
                                    className="w-full rounded-lg border-gray-300"
                                />

                                {errors.released_to && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.released_to}
                                    </p>
                                )}

                                {errors.inventory && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.inventory}
                                    </p>
                                )}

                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeApproveModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Processing...'
                                        : 'Approve & Release'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}