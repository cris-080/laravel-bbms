import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, bloodInventory, upcomingSchedules }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6">
                <h2 className="text-xl font-bold text-gray-800">System Overview</h2>

                {/* 6 Colored KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-white">
                    <div className="bg-rose-600 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-bold tracking-wider uppercase opacity-90 mb-2">Current Stock</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🩸</span>
                            <span className="text-3xl font-extrabold">{stats.totalUnitsAvailable}</span>
                        </div>
                    </div>
                    <div className="bg-emerald-600 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-bold tracking-wider uppercase opacity-90 mb-2">Total Donated</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">📦</span>
                            <span className="text-3xl font-extrabold">{stats.completedDonationsCount}</span>
                        </div>
                    </div>
                    <div className="bg-blue-600 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-bold tracking-wider uppercase opacity-90 mb-2">Total Donors</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">👥</span>
                            <span className="text-3xl font-extrabold">{stats.totalDonors}</span>
                        </div>
                    </div>
                    <div className="bg-amber-500 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-bold tracking-wider uppercase opacity-90 mb-2">Pending</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">⏳</span>
                            <span className="text-3xl font-extrabold">{stats.pendingRequestsCount}</span>
                        </div>
                    </div>
                    <div className="bg-cyan-500 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-bold tracking-wider uppercase opacity-90 mb-2">Today's Req</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">📄</span>
                            <span className="text-3xl font-extrabold">0</span>
                        </div>
                    </div>
                    <div className="bg-slate-500 p-4 rounded-lg shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-bold tracking-wider uppercase opacity-90 mb-2">Today's Apprv</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">✔️</span>
                            <span className="text-3xl font-extrabold">0</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Side: Upcoming Schedule Table */}
                    <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                            <span className="text-red-500 mr-2">📅</span>
                            <h3 className="font-bold text-gray-800">Upcoming Schedule</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                                    <tr>
                                        <th className="px-5 py-3">Date & Time</th>
                                        <th className="px-5 py-3">Donor Name</th>
                                        <th className="px-5 py-3">Group</th>
                                        <th className="px-5 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingSchedules.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center py-8 text-gray-500">No upcoming appointments.</td></tr>
                                    ) : (
                                        upcomingSchedules.map(schedule => (
                                            <tr key={schedule.id} className="border-b hover:bg-gray-50">
                                                <td className="px-5 py-3">{schedule.appointment_date} {schedule.appointment_time}</td>
                                                <td className="px-5 py-3">{schedule.donor?.name}</td>
                                                <td className="px-5 py-3 font-bold text-red-600">{schedule.donor?.blood_group}</td>
                                                <td className="px-5 py-3 text-right">{schedule.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Side: Inventory by Group Grid (Member 2's Domain) */}
                    <div className="lg:col-span-5 bg-gray-50/50 rounded-lg">
                        <div className="px-2 py-2 flex items-center mb-2">
                            <span className="text-red-500 mr-2">🩸</span>
                            <h3 className="font-bold text-gray-800">Inventory by Group</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {bloodInventory.map((item) => (
                                <div key={item.id} className="bg-white rounded-md border border-gray-200 p-3 flex justify-between items-center shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shadow-inner">
                                        {item.blood_group}
                                    </div>
                                    <div className="text-right flex flex-col leading-tight">
                                        <span className="text-xl font-extrabold text-gray-900">{item.total_units}</span>
                                        <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">Units</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}