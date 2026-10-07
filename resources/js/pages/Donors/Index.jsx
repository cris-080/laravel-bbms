import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ donors, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [bloodGroup, setBloodGroup] = useState(filters.blood_group || '');

    const submitFilter = (e) => {
        e.preventDefault();

        router.get(
            '/donors',
            {
                search,
                blood_group: bloodGroup,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch('');
        setBloodGroup('');

        router.get('/donors');
    };

    const deleteDonor = (donor) => {
        if (confirm(`Are you sure you want to delete ${donor.name}?`)) {
            router.delete(`/donors/${donor.id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Manage Donors">
            <Head title="Manage Donors" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Blood Donors
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage registered blood donors and donation eligibility.
                        </p>
                    </div>

                    <Link
                        href="/donors/create"
                        className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        + Add Donor
                    </Link>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <form
                        onSubmit={submitFilter}
                        className="flex flex-col gap-3 md:flex-row"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, or contact..."
                            className="w-full rounded-lg border-gray-300 md:flex-1"
                        />

                        <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="rounded-lg border-gray-300"
                        >
                            <option value="">All Blood Groups</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
                        >
                            Filter
                        </button>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </form>
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
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Last Donation
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Eligibility
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {donors.data.length > 0 ? (
                                    donors.data.map((donor) => (
                                        <tr key={donor.id}>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {donor.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {donor.email || 'No email'}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                                    {donor.blood_group}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {donor.contact_number}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {donor.last_donation_date || 'No previous donation'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {donor.is_eligible ? (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Eligible
                                                    </span>
                                                ) : (
                                                    <div>
                                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                            Not Eligible
                                                        </span>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Eligible on {donor.next_eligible_date}
                                                        </p>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/donors/${donor.id}/edit`}
                                                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        onClick={() => deleteDonor(donor)}
                                                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No donors found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {donors.links && (
                        <div className="flex flex-wrap gap-2 border-t p-4">
                            {donors.links.map((link, index) => (
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