import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ donors = { data: [], links: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [bloodGroup, setBloodGroup] = useState(filters.blood_group || '');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState(null);

    // Form Hook
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        age: '',
        sex: '',
        blood_group: '',
        contact_number: '',
        address: '',
        last_donation_date: '',
    });

    // Quick Stats from loaded page
    const totalCount = donors.total ?? donors.data?.length ?? 0;
    const eligibleCount = donors.data?.filter(d => d.is_eligible).length ?? 0;
    const pendingEligibilityCount = (donors.data?.length ?? 0) - eligibleCount;

    const submitFilter = (e) => {
        e.preventDefault();
        router.get('/donors', { search, blood_group: bloodGroup }, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setBloodGroup('');
        router.get('/donors');
    };

    const deleteDonor = (donor) => {
        if (confirm(`Are you sure you want to delete ${donor.name}? This action cannot be undone.`)) {
            router.delete(`/donors/${donor.id}`);
        }
    };

    // Modal Control
    const openCreateModal = () => {
        setEditingDonor(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (donor) => {
        setEditingDonor(donor);
        setData({
            name: donor.name || '',
            email: donor.email || '',
            age: donor.age || '',
            sex: donor.sex || '',
            blood_group: donor.blood_group || '',
            contact_number: donor.contact_number || '',
            address: donor.address || '',
            last_donation_date: donor.last_donation_date || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (editingDonor) {
            put(`/donors/${editingDonor.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/donors', { onSuccess: () => closeModal() });
        }
    };

    return (
        <AuthenticatedLayout title="Manage Donors">
            <Head title="Manage Donors" />

            <div className="max-w-7xl mx-auto space-y-6 pb-10">
                {/* Header & Primary Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Blood Donors
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage donor database, contact directories, and automated 56-day eligibility cycles.
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
                        <span>Add New Donor</span>
                    </button>
                </div>

                {/* Metrics / KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Registered</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalCount}</p>
                        </div>
                        <span className="p-2.5 bg-gray-100 rounded-lg text-gray-600 text-sm font-semibold">
                            Donors
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Eligible Now</p>
                            <p className="text-xl font-bold text-emerald-600 mt-0.5">{eligibleCount}</p>
                        </div>
                        <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">
                            Ready
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recovery Period</p>
                            <p className="text-xl font-bold text-amber-600 mt-0.5">{pendingEligibilityCount}</p>
                        </div>
                        <span className="p-2.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold">
                            Resting
                        </span>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80">
                    <form onSubmit={submitFilter} className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, or contact number..."
                                className="w-full pl-10 pr-9 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium text-gray-700"
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

                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                Apply
                            </button>
                            {(search || bloodGroup) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm divide-y divide-gray-200">
                            <thead className="bg-gray-50/75 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5">Donor Profile</th>
                                    <th className="px-6 py-3.5">Blood Type</th>
                                    <th className="px-6 py-3.5">Contact Details</th>
                                    <th className="px-6 py-3.5">Last Donation</th>
                                    <th className="px-6 py-3.5">Eligibility Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {donors.data && donors.data.length > 0 ? (
                                    donors.data.map((donor) => (
                                        <tr key={donor.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-100 shrink-0">
                                                        {donor.name?.charAt(0) || 'D'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 leading-tight">{donor.name}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">{donor.email || 'No email registered'}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100/70 text-red-700 border border-red-200">
                                                    {donor.blood_group}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 font-medium">{donor.contact_number}</div>
                                                {donor.address && (
                                                    <div className="text-xs text-gray-400 truncate max-w-xs">{donor.address}</div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {donor.last_donation_date ? (
                                                    <span className="font-medium text-gray-800">{donor.last_donation_date}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">No previous logs</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                {donor.is_eligible ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        Eligible to Donate
                                                    </span>
                                                ) : (
                                                    <div className="space-y-0.5">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                            In Recovery
                                                        </span>
                                                        <p className="text-[11px] text-gray-500 font-medium">
                                                            Available on: {donor.next_eligible_date}
                                                        </p>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(donor)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                                                        title="Edit Donor Profile"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => deleteDonor(donor)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                                                        title="Delete Donor"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-3 bg-gray-100 rounded-full text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium text-sm">No donors found</p>
                                                <p className="text-gray-400 text-xs">Try adjusting your search criteria or register a new donor.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {donors.links && donors.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                            <span className="text-xs text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{donors.data?.length}</span> donors on this page
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {donors.links.map((link, index) => (
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

            {/* Enhanced Reusable Form Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">
                                        {editingDonor ? 'Edit Donor Profile' : 'Register New Donor'}
                                    </h2>
                                    <p className="text-xs text-red-100 mt-0.5">
                                        {editingDonor ? 'Update personal details and historical donation date' : 'Enter personal record to calculate donation eligibility'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={closeModal}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submitForm} className="p-6 space-y-6">
                        {/* Section 1: Personal Details */}
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                                Personal Information
                            </span>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Juan dela Cruz"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="donor@example.com"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Age <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.age}
                                        onChange={(e) => setData('age', e.target.value)}
                                        placeholder="18-65"
                                        className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    />
                                    {errors.age && <p className="mt-1 text-xs text-red-600 font-medium">{errors.age}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Sex <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.sex}
                                        onChange={(e) => setData('sex', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium text-gray-700"
                                    >
                                        <option value="">Choose sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.sex && <p className="mt-1 text-xs text-red-600 font-medium">{errors.sex}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            value={data.contact_number}
                                            onChange={(e) => setData('contact_number', e.target.value)}
                                            placeholder="0912 345 6789"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        />
                                    </div>
                                    {errors.contact_number && <p className="mt-1 text-xs text-red-600 font-medium">{errors.contact_number}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="City, Province"
                                        className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    />
                                    {errors.address && <p className="mt-1 text-xs text-red-600 font-medium">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Blood & Eligibility Details */}
                        <div className="pt-2 border-t border-gray-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                                Blood & Medical Details
                            </span>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Blood Group <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.blood_group}
                                        onChange={(e) => setData('blood_group', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-red-50/30 border border-red-200 text-gray-800 font-semibold rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    >
                                        <option value="">Select blood type</option>
                                        <option value="A+">A+ (A Positive)</option>
                                        <option value="A-">A- (A Negative)</option>
                                        <option value="B+">B+ (B Positive)</option>
                                        <option value="B-">B- (B Negative)</option>
                                        <option value="AB+">AB+ (AB Positive)</option>
                                        <option value="AB-">AB- (AB Negative)</option>
                                        <option value="O+">O+ (O Positive)</option>
                                        <option value="O-">O- (O Negative)</option>
                                    </select>
                                    {errors.blood_group && <p className="mt-1 text-xs text-red-600 font-medium">{errors.blood_group}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Last Donation Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.last_donation_date}
                                        onChange={(e) => setData('last_donation_date', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    />
                                    <p className="mt-1 text-[11px] text-gray-400">Leave blank if this is their first registered donation.</p>
                                    {errors.last_donation_date && <p className="mt-1 text-xs text-red-600 font-medium">{errors.last_donation_date}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={closeModal}
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
                                        <span>{editingDonor ? 'Update Donor' : 'Save Donor'}</span>
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