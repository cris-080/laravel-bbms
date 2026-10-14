import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({
    stats = {},
    bloodInventory = [],
    upcomingSchedules = [],
    recentRequests = [],
    recentAuditLogs = [],
}) {
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '—';
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6 pb-12">
                {/* Header Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 via-rose-600 to-red-600 p-6 sm:p-8 text-white shadow-lg shadow-red-500/10">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Blood Bank Control Center
                            </h1>
                            <p className="text-sm text-red-100 max-w-xl">
                                Real-time monitoring of blood unit reserves, donor collection schedules, and hospital requisitions.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/blood-requests"
                                className="px-4 py-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors shadow-sm"
                            >
                                View Requisitions
                            </Link>
                            <Link
                                href="/donations"
                                className="px-4 py-2.5 rounded-xl bg-red-800/60 hover:bg-red-800 text-white font-semibold text-sm transition-colors backdrop-blur-sm border border-white/10"
                            >
                                Collection Log
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 5 Primary Dynamic KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Available Stock */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Available Stock
                            </span>
                            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {stats.totalUnitsAvailable ?? 0}
                            </div>
                            <span className="text-xs font-medium text-rose-600 mt-0.5 block">Total Units in Reserve</span>
                        </div>
                    </div>

                    {/* Total Donors */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Total Donors
                            </span>
                            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {stats.totalDonors ?? 0}
                            </div>
                            <span className="text-xs font-medium text-blue-600 mt-0.5 block">Registered in Directory</span>
                        </div>
                    </div>

                    {/* Completed Donations */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Donations Logged
                            </span>
                            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {stats.completedDonationsCount ?? 0}
                            </div>
                            <span className="text-xs font-medium text-emerald-600 mt-0.5 block">Completed Collections</span>
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Pending Requests
                            </span>
                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {stats.pendingRequestsCount ?? 0}
                            </div>
                            <span className="text-xs font-medium text-amber-600 mt-0.5 block">Awaiting Dispense</span>
                        </div>
                    </div>

                    {/* Scheduled Appointments */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Upcoming Visits
                            </span>
                            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {stats.scheduledAppointmentsCount ?? 0}
                            </div>
                            <span className="text-xs font-medium text-purple-600 mt-0.5 block">Scheduled Appointments</span>
                        </div>
                    </div>
                </div>

                {/* Blood Inventory Distribution Grid */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-2">
                        <div className="flex items-center space-x-2.5">
                            <div className="p-2 rounded-lg bg-red-50 text-red-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Inventory by Blood Group</h3>
                                <p className="text-xs text-gray-500">Central depot reserves per antigen type</p>
                            </div>
                        </div>
                        <Link
                            href="/inventory"
                            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                        >
                            Open Detailed Inventory →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-5">
                        {bloodInventory.map((item) => {
                            const isLowStock = item.total_units < 5;
                            return (
                                <div
                                    key={item.id}
                                    className={`relative rounded-xl p-3 border transition-all ${
                                        isLowStock
                                            ? 'bg-rose-50/40 border-rose-200'
                                            : 'bg-gray-50/50 border-gray-200/80 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs bg-red-600 text-white shadow-sm">
                                            {item.blood_group}
                                        </span>
                                        {isLowStock && (
                                            <span className="w-2 h-2 rounded-full bg-rose-500" title="Low Stock (&lt; 5 units)" />
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-xl font-black text-gray-900 tracking-tight">
                                            {item.total_units}
                                        </div>
                                        <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400">
                                            Units
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Operational Data Grids: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Upcoming Schedules */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <h3 className="font-bold text-gray-900">Upcoming Appointments</h3>
                            </div>
                            <Link href="/schedules" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                View All ({stats.scheduledAppointmentsCount ?? 0})
                            </Link>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-sm divide-y divide-gray-100">
                                <thead className="bg-gray-50/60 text-gray-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Donor</th>
                                        <th className="px-6 py-3">Group</th>
                                        <th className="px-6 py-3">Date & Time</th>
                                        <th className="px-6 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {upcomingSchedules.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-400 text-xs">
                                                No upcoming appointments scheduled.
                                            </td>
                                        </tr>
                                    ) : (
                                        upcomingSchedules.map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-3.5">
                                                    <span className="font-semibold text-gray-900 block">
                                                        {schedule.donor?.name || 'Unknown Donor'}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400">
                                                        #{schedule.donor_id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                                                        {schedule.donor?.blood_group || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 text-xs text-gray-600">
                                                    <span className="font-medium text-gray-800 block">
                                                        {formatDate(schedule.appointment_date)}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        {formatTime(schedule.appointment_time)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                        {schedule.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Recent Blood Requests */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                <h3 className="font-bold text-gray-900">Recent Hospital Requests</h3>
                            </div>
                            <Link href="/blood-requests" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                                View All ({recentRequests.length})
                            </Link>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-sm divide-y divide-gray-100">
                                <thead className="bg-gray-50/60 text-gray-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Patient / Doctor</th>
                                        <th className="px-6 py-3">Group</th>
                                        <th className="px-6 py-3">Units</th>
                                        <th className="px-6 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-400 text-xs">
                                                No recent requisitions.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-3.5">
                                                    <span className="font-semibold text-gray-900 block">
                                                        {request.patient_name}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400">
                                                        Dr. {request.physician_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                                                        {request.blood_group}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 font-bold text-gray-800 text-xs">
                                                    {request.units_needed} <span className="font-normal text-gray-400">Bags</span>
                                                </td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            request.status === 'Handed Over'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : request.status === 'Pending'
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                request.status === 'Handed Over'
                                                                    ? 'bg-emerald-500'
                                                                    : request.status === 'Pending'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-gray-400'
                                                            }`}
                                                        />
                                                        {request.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Admin Audit Trail: Appears only if Admin Logs are populated */}
                {recentAuditLogs && recentAuditLogs.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center space-x-2.5">
                                <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Recent Security & Activity Trail</h3>
                                    <p className="text-xs text-gray-500">Live operational ledger for system auditing</p>
                                </div>
                            </div>
                            <Link href="/audit-logs" className="text-xs font-semibold text-gray-600 hover:text-gray-900">
                                View Full Audit Ledger →
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-100 mt-2">
                            {recentAuditLogs.map((log) => (
                                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center space-x-3">
                                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-900">{log.action}</span>
                                            <span className="text-gray-500 mx-2">—</span>
                                            <span className="text-gray-600">{log.details}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-400 shrink-0">
                                        <span>User: <strong className="text-gray-700 font-medium">{log.user?.name || 'System'}</strong></span>
                                        <span>•</span>
                                        <span>{formatDateTime(log.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}