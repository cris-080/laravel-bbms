import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ schedules = { data: [], links: [] }, donors = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form Hook for Scheduling
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        donor_id: '',
        appointment_date: '',
        appointment_time: '',
    });

    const selectedDonor = donors.find(
        (donor) => String(donor.id) === String(data.donor_id)
    );

    // Filter appointments by donor name or blood group
    const filteredSchedules = (schedules.data || []).filter((schedule) => {
        const query = searchTerm.toLowerCase();
        return (
            schedule.donor?.name?.toLowerCase().includes(query) ||
            schedule.donor?.blood_group?.toLowerCase().includes(query) ||
            schedule.status?.toLowerCase().includes(query)
        );
    });

    // KPI Metrics
    const totalCount = schedules.total ?? schedules.data?.length ?? 0;
    const scheduledCount = (schedules.data || []).filter((s) => s.status === 'Scheduled').length;
    const completedCount = (schedules.data || []).filter((s) => s.status === 'Completed').length;
    const cancelledCount = (schedules.data || []).filter((s) => s.status === 'Cancelled').length;

    // Modal Control
    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset();
        clearErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post('/schedules', {
            preserveScroll: true,
            onSuccess: () => closeCreateModal(),
        });
    };

    const updateStatus = (schedule, status) => {
        const confirmMsg = status === 'Completed'
            ? `Mark appointment for ${schedule.donor?.name} as Completed?`
            : `Cancel appointment for ${schedule.donor?.name}?`;

        if (confirm(confirmMsg)) {
            router.patch(
                `/schedules/${schedule.id}/status`,
                { status },
                { preserveScroll: true }
            );
        }
    };

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

    return (
        <AuthenticatedLayout title="Donation Schedules">
            <Head title="Donation Schedules" />

            <div className="max-w-7xl mx-auto space-y-6 pb-10">
                {/* Header & Primary Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Donation Schedules
                            </h1>
                            <p className="text-sm text-gray-500">
                                Coordinate donor appointments, track booking attendance, and manage visit statuses.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Schedule</span>
                    </button>
                </div>

                {/* Metrics / KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalCount}</p>
                        </div>
                        <span className="p-2.5 bg-gray-100 rounded-lg text-gray-600 text-sm font-semibold">
                            Visits
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upcoming</p>
                            <p className="text-xl font-bold text-blue-600 mt-0.5">{scheduledCount}</p>
                        </div>
                        <span className="p-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                            Scheduled
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</p>
                            <p className="text-xl font-bold text-emerald-600 mt-0.5">{completedCount}</p>
                        </div>
                        <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">
                            Fulfilled
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cancelled</p>
                            <p className="text-xl font-bold text-gray-400 mt-0.5">{cancelledCount}</p>
                        </div>
                        <span className="p-2.5 bg-gray-50 text-gray-500 rounded-lg text-sm font-semibold">
                            Voided
                        </span>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80">
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search by donor name, blood group, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-9 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm divide-y divide-gray-200">
                            <thead className="bg-gray-50/75 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5">Donor Name</th>
                                    <th className="px-6 py-3.5">Blood Type</th>
                                    <th className="px-6 py-3.5">Appointment Date</th>
                                    <th className="px-6 py-3.5">Appointment Time</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredSchedules.length > 0 ? (
                                    filteredSchedules.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-100">
                                                        {schedule.donor?.name?.charAt(0) || 'D'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 leading-tight">
                                                            {schedule.donor?.name || 'Unknown Donor'}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            Donor #{schedule.donor_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100/70 text-red-700 border border-red-200">
                                                    {schedule.donor?.blood_group || '—'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-gray-700 font-medium">
                                                {formatDate(schedule.appointment_date)}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600 font-medium">
                                                {formatTime(schedule.appointment_time)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        schedule.status === 'Completed'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : schedule.status === 'Scheduled'
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            schedule.status === 'Completed'
                                                                ? 'bg-emerald-500'
                                                                : schedule.status === 'Scheduled'
                                                                ? 'bg-blue-500'
                                                                : 'bg-gray-400'
                                                        }`}
                                                    />
                                                    {schedule.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {schedule.status === 'Scheduled' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateStatus(schedule, 'Completed')}
                                                            className="inline-flex items-center space-x-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                            title="Mark as Completed"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>Complete</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => updateStatus(schedule, 'Cancelled')}
                                                            className="inline-flex items-center space-x-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                                                            title="Cancel Appointment"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            <span>Cancel</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {schedule.status === 'Completed' ? 'Fulfilled' : 'Archived'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-3 bg-gray-100 rounded-full text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium text-sm">No donation schedules found</p>
                                                <p className="text-gray-400 text-xs">Create an appointment to reserve a donation slot.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {schedules.links && schedules.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                            <span className="text-xs text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{schedules.data?.length}</span> schedules
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {schedules.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-red-600 text-white shadow-sm'
                                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                        } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: New Donation Schedule */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal} maxWidth="xl">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">New Donation Schedule</h2>
                                    <p className="text-xs text-red-100 mt-0.5">
                                        Book a donor collection appointment slot
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeCreateModal}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submitCreate} className="p-6 space-y-5">
                        {/* Donor Selection */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                Select Donor <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <select
                                    value={data.donor_id}
                                    onChange={(e) => setData('donor_id', e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium text-gray-800"
                                >
                                    <option value="">-- Choose a Registered Donor --</option>
                                    {donors.map((donor) => (
                                        <option key={donor.id} value={donor.id}>
                                            {donor.name} ({donor.blood_group})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.donor_id && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{errors.donor_id}</p>
                            )}

                            {selectedDonor && (
                                <div className="mt-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">Blood Group:</span>
                                        <span className="font-bold text-red-600">{selectedDonor.blood_group}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">Last Donation:</span>
                                        <span className="font-semibold text-gray-800">
                                            {selectedDonor.last_donation_date || 'No previous donation'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Appointment Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.appointment_date}
                                    onChange={(e) => setData('appointment_date', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                />
                                {errors.appointment_date && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.appointment_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Appointment Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.appointment_time}
                                    onChange={(e) => setData('appointment_time', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                />
                                {errors.appointment_time && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.appointment_time}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={closeCreateModal}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-red-500/20 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all disabled:opacity-50"
                            >
                                {processing ? (
                                    <span>Saving...</span>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Create Schedule</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}