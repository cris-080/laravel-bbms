import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ donations = [], donors = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonation, setEditingDonation] = useState(null);

    // Form logic unified for Create and Edit
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        donor_id: '',
        donation_date: new Date().toISOString().split('T')[0],
        units_donated: 1,
        status: 'Completed',
    });

    const filteredDonations = donations.filter(donation => {
        const search = searchTerm.toLowerCase();
        return (
            donation.donor?.name?.toLowerCase().includes(search) ||
            donation.donor?.blood_group?.toLowerCase().includes(search)
        );
    });

    // Quick Stats Calculation
    const totalUnits = donations.reduce((sum, d) => sum + (Number(d.units_donated) || 0), 0);
    const completedCount = donations.filter(d => d.status === 'Completed').length;

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this record? If it was completed, this will deduct the units back out of the inventory.')) {
            router.delete(`/donations/${id}`);
        }
    };

    // Modal Handlers
    const openCreateModal = () => {
        setEditingDonation(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (donation) => {
        setEditingDonation(donation);
        setData({
            donor_id: donation.donor_id,
            donation_date: donation.donation_date,
            units_donated: donation.units_donated,
            status: donation.status,
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
        if (editingDonation) {
            put(`/donations/${editingDonation.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/donations', {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Blood Collection Log" />

            <div className="max-w-7xl mx-auto space-y-6 pb-10">
                {/* Header & Quick Stats */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Blood Collection Log
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Track collected blood bags and synchronize stock with central inventory.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Log New Donation</span>
                    </button>
                </div>

                {/* KPI Overview Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Logs</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{donations.length}</p>
                        </div>
                        <span className="p-2.5 bg-gray-100 rounded-lg text-gray-600 text-sm font-semibold">
                            Records
                        </span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Units Collected</p>
                            <p className="text-xl font-bold text-red-600 mt-0.5">{totalUnits} Units</p>
                        </div>
                        <span className="p-2.5 bg-red-50 text-red-700 rounded-lg text-sm font-semibold">
                            Bags
                        </span>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed Stock Ins</p>
                            <p className="text-xl font-bold text-emerald-600 mt-0.5">{completedCount}</p>
                        </div>
                        <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">
                            Processed
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
                            placeholder="Search by donor name or blood group..." 
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
                                    <th className="px-6 py-3.5">Donor</th>
                                    <th className="px-6 py-3.5">Collection Date</th>
                                    <th className="px-6 py-3.5">Blood Group</th>
                                    <th className="px-6 py-3.5">Volume</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDonations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-3 bg-gray-100 rounded-full text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium text-sm">No donation records found</p>
                                                <p className="text-gray-400 text-xs">Try adjusting your search criteria or register a new collection.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDonations.map(donation => (
                                        <tr key={donation.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-100">
                                                        {donation.donor?.name?.charAt(0) || 'D'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{donation.donor?.name || 'Unknown Donor'}</div>
                                                        <div className="text-xs text-gray-400">Donor ID #{donation.donor_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 font-medium">
                                                {formatDate(donation.donation_date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100/70 text-red-700 border border-red-200">
                                                    {donation.donor?.blood_group || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">{donation.units_donated}</span>
                                                <span className="text-gray-500 text-xs ml-1 font-normal">Units</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    donation.status === 'Completed' 
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                                                    donation.status === 'Pending' 
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                                                        'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        donation.status === 'Completed' ? 'bg-emerald-500' :
                                                        donation.status === 'Pending' ? 'bg-amber-500' : 'bg-gray-400'
                                                    }`} />
                                                    {donation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button 
                                                        onClick={() => openEditModal(donation)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors" 
                                                        title="Edit Donation"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(donation.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors" 
                                                        title="Delete Donation"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Enhanced Form Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">
                                        {editingDonation ? 'Edit Donation Record' : 'Record New Donation'}
                                    </h2>
                                    <p className="text-xs text-red-100 mt-0.5">
                                        {editingDonation 
                                            ? 'Modifications recalculate stock adjustments automatically' 
                                            : 'Log a blood collection to increment live inventory stock'}
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

                    <form onSubmit={submitForm} className="p-6 space-y-5">
                        {/* Donor Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                Registered Donor <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <select 
                                    value={data.donor_id} 
                                    onChange={e => setData('donor_id', e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                >
                                    <option value="">-- Choose a Registered Donor --</option>
                                    {donors?.map(donor => (
                                        <option key={donor.id} value={donor.id}>
                                            {donor.name} ({donor.blood_group})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.donor_id && <p className="text-red-600 text-xs mt-1 font-medium">{errors.donor_id}</p>}
                        </div>

                        {/* Date and Units */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Donation Date <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="date" 
                                    value={data.donation_date} 
                                    onChange={e => setData('donation_date', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                />
                                {errors.donation_date && <p className="text-red-600 text-xs mt-1 font-medium">{errors.donation_date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Units Collected <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={data.units_donated} 
                                        onChange={e => setData('units_donated', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    />
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-gray-400">
                                        Units
                                    </span>
                                </div>
                                {errors.units_donated && <p className="text-red-600 text-xs mt-1 font-medium">{errors.units_donated}</p>}
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={data.status} 
                                onChange={e => setData('status', e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium text-gray-800"
                            >
                                <option value="Completed">Completed (Automatically Updates Stock)</option>
                                <option value="Pending">Pending (Awaiting Collection)</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <p className="mt-1 text-[11px] text-gray-400">
                                Setting status to Completed immediately increments the inventory of the matching blood group.
                            </p>
                            {errors.status && <p className="text-red-600 text-xs mt-1 font-medium">{errors.status}</p>}
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
                                        <span>{editingDonation ? 'Update Record' : 'Save Record'}</span>
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