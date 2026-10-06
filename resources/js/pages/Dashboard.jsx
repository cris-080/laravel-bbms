import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;

    const logout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Dashboard - Blood Bank Management System" />

            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Blood Bank Dashboard
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Welcome, <span className="font-semibold">{auth.user?.name}</span>! Role:{' '}
                                    <span className="uppercase font-bold text-red-600">
                                        {auth.roles?.join(', ')}
                                    </span>
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/donors"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Manage Donors
                            </Link>

                            <Link
                                href="/inventory"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Blood Inventory
                            </Link>

                            <Link
                                href="/donations"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Donations
                            </Link>

                            <Link
                                href="/blood-requests"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Blood Requests
                            </Link>

                            <Link
                                href="/schedules"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Donation Schedules
                            </Link>

                            {auth.roles.includes('admin') && (
                                <>
                                    <Link
                                        href="/users"
                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                    >
                                        Manage Staff (Admin Only)
                                    </Link>
                                    <Link
                                        href="/audit-logs"
                                        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                                    >
                                        Audit Logs (Admin Only)
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}