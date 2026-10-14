import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ requests = { data: [], links: [] }, inventory = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Approval Modal State
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

    // Form Hook: Create Request
    const {
        data: createData,
        setData: setCreateData,
        post: postCreate,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreate,
        clearErrors: clearCreateErrors,
    } = useForm({
        physician_name: '',
        patient_name: '',
        blood_group: '',
        units_needed: '',
    });

    // Form Hook: Approve / Dispense
    const {
        data: approveData,
        setData: setApproveData,
        post: postApprove,
        processing: approveProcessing,
        errors: approveErrors,
        reset: resetApprove,
        clearErrors: clearApproveErrors,
    } = useForm({
        released_to: '',
    });

    // Live inventory check for Create Modal
    const selectedInventory = inventory.find(
        (item) => item.blood_group === createData.blood_group
    );
    const isExceedingStock = selectedInventory && Number(createData.units_needed) > Number(selectedInventory.total_units);

    // Filtered requests by patient or physician
    const filteredRequests = (requests.data || []).filter((req) => {
        const query = searchTerm.toLowerCase();
        return (
            req.patient_name?.toLowerCase().includes(query) ||
            req.physician_name?.toLowerCase().includes(query) ||
            req.blood_group?.toLowerCase().includes(query) ||
            req.reference_code?.toLowerCase().includes(query)
        );
    });

    // Quick Stats Calculation
    const totalRequestsCount = requests.total ?? requests.data?.length ?? 0;
    const pendingCount = (requests.data || []).filter((r) => r.status === 'Pending').length;
    const handedOverCount = (requests.data || []).filter((r) => r.status === 'Handed Over').length;

    // Create Modal Handlers
    const openCreateModal = () => {
        resetCreate();
        clearCreateErrors();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        resetCreate();
        clearCreateErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        postCreate('/blood-requests', {
            preserveScroll: true,
            onSuccess: () => closeCreateModal(),
        });
    };

    // Approve Modal Handlers
    const openApproveModal = (request) => {
        setSelectedRequest(request);
        resetApprove();
        clearApproveErrors();
        setIsApproveModalOpen(true);
    };

    const closeApproveModal = () => {
        setSelectedRequest(null);
        setIsApproveModalOpen(false);
        resetApprove();
        clearApproveErrors();
    };

    const submitApprove = (e) => {
        e.preventDefault();
        if (!selectedRequest) return;

        postApprove(`/blood-requests/${selectedRequest.id}/approve`, {
            preserveScroll: true,
            onSuccess: () => closeApproveModal(),
        });
    };

    const rejectRequest = (request) => {
        if (confirm(`Are you sure you want to reject the blood request for ${request.patient_name}?`)) {
            router.post(
                `/blood-requests/${request.id}/reject`,
                {},
                { preserveScroll: true }
            );
        }
    };

    return (
        <AuthenticatedLayout title="Blood Requests">
            <Head title="Blood Requests" />

            <div className="max-w-7xl mx-auto space-y-6 pb-10">
                {/* Header & Primary Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Blood Requests
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage hospital patient orders, inventory verification, dispensing, and rejections.
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
                        <span>New Blood Request</span>
                    </button>
                </div>

                {/* Metrics / KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Requisitions</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalRequestsCount}</p>
                        </div>
                        <span className="p-2.5 bg-gray-100 rounded-lg text-gray-600 text-sm font-semibold">
                            Orders
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Awaiting Dispense</p>
                            <p className="text-xl font-bold text-amber-600 mt-0.5">{pendingCount}</p>
                        </div>
                        <span className="p-2.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold">
                            Pending
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Handed Over</p>
                            <p className="text-xl font-bold text-emerald-600 mt-0.5">{handedOverCount}</p>
                        </div>
                        <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">
                            Dispensed
                        </span>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80">
                    <div className="relative max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search patient, physician, or reference code..."
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
                                    <th className="px-6 py-3.5">Patient Details</th>
                                    <th className="px-6 py-3.5">Attending Physician</th>
                                    <th className="px-6 py-3.5">Blood Group</th>
                                    <th className="px-6 py-3.5">Units Needed</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5">Tracking Code</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900 leading-tight">
                                                    {request.patient_name}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    Req: {request.request_date || 'N/A'}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="text-gray-800 font-medium">{request.physician_name}</div>
                                                <div className="text-xs text-gray-400">Physician</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100/70 text-red-700 border border-red-200">
                                                    {request.blood_group}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">{request.units_needed}</span>
                                                <span className="text-gray-500 text-xs ml-1 font-normal">Units</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        request.status === 'Handed Over'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : request.status === 'Pending'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : request.status === 'Approved'
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : 'bg-red-50 text-red-700 border border-red-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            request.status === 'Handed Over'
                                                                ? 'bg-emerald-500'
                                                                : request.status === 'Pending'
                                                                ? 'bg-amber-500'
                                                                : request.status === 'Approved'
                                                                ? 'bg-blue-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    />
                                                    {request.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {request.reference_code ? (
                                                    <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                                        {request.reference_code}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">Unassigned</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {request.status === 'Pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openApproveModal(request)}
                                                            className="inline-flex items-center space-x-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                                        >
                                                            <span>Approve</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => rejectRequest(request)}
                                                            className="inline-flex items-center space-x-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                                                        >
                                                            <span>Reject</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {request.status === 'Handed Over' ? 'Dispensed' : 'Closed'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-3 bg-gray-100 rounded-full text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium text-sm">No blood requests found</p>
                                                <p className="text-gray-400 text-xs">Create a new blood request to initiate dispensing workflow.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {requests.links && requests.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                            <span className="text-xs text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{requests.data?.length}</span> requests
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {requests.links.map((link, index) => (
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

            {/* Modal 1: Create Blood Request */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal} maxWidth="xl">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">New Blood Request</h2>
                                    <p className="text-xs text-red-100 mt-0.5">
                                        Submit requisition details for clinical review and blood reserve allocation
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
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Patient Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        value={createData.patient_name}
                                        onChange={(e) => setCreateData('patient_name', e.target.value)}
                                        placeholder="Full patient name"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    />
                                </div>
                                {createErrors.patient_name && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{createErrors.patient_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Attending Physician <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        value={createData.physician_name}
                                        onChange={(e) => setCreateData('physician_name', e.target.value)}
                                        placeholder="Dr. Full Name"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    />
                                </div>
                                {createErrors.physician_name && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{createErrors.physician_name}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                Blood Group Required <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={createData.blood_group}
                                onChange={(e) => setCreateData('blood_group', e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 font-medium rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                            >
                                <option value="">Select compatible group</option>
                                {inventory.map((item) => (
                                    <option key={item.blood_group} value={item.blood_group}>
                                        {item.blood_group} — ({item.total_units} unit{item.total_units === 1 ? '' : 's'} available)
                                    </option>
                                ))}
                            </select>
                            {createErrors.blood_group && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{createErrors.blood_group}</p>
                            )}

                            {selectedInventory && (
                                <div className="mt-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between">
                                    <span className="text-xs text-gray-600 font-medium">Available Units in Bank:</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        selectedInventory.total_units > 0 
                                            ? 'bg-emerald-100 text-emerald-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedInventory.total_units} Unit(s)
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                Units Needed <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    value={createData.units_needed}
                                    onChange={(e) => setCreateData('units_needed', e.target.value)}
                                    placeholder="Number of units"
                                    className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-gray-400">
                                    Bags
                                </span>
                            </div>
                            {createErrors.units_needed && (
                                <p className="mt-1 text-xs text-red-600 font-medium">{createErrors.units_needed}</p>
                            )}

                            {isExceedingStock && (
                                <p className="mt-1 text-xs text-amber-600 font-medium flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Warning: Requested quantity exceeds current available inventory stock ({selectedInventory.total_units} available).
                                </p>
                            )}
                        </div>

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
                                disabled={createProcessing}
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-red-500/20 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all disabled:opacity-50"
                            >
                                {createProcessing ? (
                                    <span>Submitting...</span>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Submit Request</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal 2: Approve & Dispense */}
            <Modal show={isApproveModalOpen} onClose={closeApproveModal} maxWidth="md">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">Approve & Dispense</h2>
                                    <p className="text-xs text-emerald-100 mt-0.5">
                                        Confirm blood release and generate official transaction code
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeApproveModal}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {selectedRequest && (
                        <form onSubmit={submitApprove} className="p-6 space-y-4">
                            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Patient:</span>
                                    <span className="font-semibold text-gray-900">{selectedRequest.patient_name}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Physician:</span>
                                    <span className="font-semibold text-gray-900">{selectedRequest.physician_name}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Required:</span>
                                    <span className="font-bold text-red-600">
                                        {selectedRequest.units_needed} Unit(s) of {selectedRequest.blood_group}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Released To (Recipient / Hospital Staff) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={approveData.released_to}
                                    onChange={(e) => setApproveData('released_to', e.target.value)}
                                    placeholder="e.g. Nurse Maria Santos / Ward 3"
                                    className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                                />
                                {approveErrors.released_to && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{approveErrors.released_to}</p>
                                )}
                                {approveErrors.inventory && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{approveErrors.inventory}</p>
                                )}
                                {approveErrors.status && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{approveErrors.status}</p>
                                )}
                            </div>

                            <p className="text-[11px] text-gray-400">
                                Approving will immediately decrement inventory units and generate a non-reusable reference code.
                            </p>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeApproveModal}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={approveProcessing}
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] transition-all disabled:opacity-50"
                                >
                                    {approveProcessing ? 'Processing...' : 'Approve & Release'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}