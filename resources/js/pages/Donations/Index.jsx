import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ donations }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDonations = donations.filter(donation => {
        const search = searchTerm.toLowerCase();
        return (
            donation.donor?.name.toLowerCase().includes(search) ||
            donation.donor?.blood_group.toLowerCase().includes(search)
        );
    });

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Function to handle deletion with a confirmation prompt
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this record? If it was completed, this will deduct the units back out of the inventory.')) {
            router.delete(`/donations/${id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Blood Collection Log" />

            <div className="max-w-7xl mx-auto pb-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Blood Collection Log</h2>
                    <Link 
                        href="/donations/create" 
                        className="bg-red-600 text-white px-4 py-2 rounded shadow-sm hover:bg-red-700 font-medium flex items-center space-x-2 transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                        <span>Log New Donation</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex w-full md:w-1/3 mb-4 shadow-sm rounded-md">
                    <input 
                        type="text" 
                        placeholder="Search name, email, or blood group..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border-gray-300 rounded-l-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-900 font-extrabold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Donor Name</th>
                                <th className="px-6 py-4">Donation Date</th>
                                <th className="px-6 py-4">Blood Group</th>
                                <th className="px-6 py-4">Volume Donated</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">No records found.</td>
                                </tr>
                            ) : (
                                filteredDonations.map(donation => (
                                    <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-800">{donation.donor?.name}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{formatDate(donation.donation_date)}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider shadow-sm">
                                                {donation.donor?.blood_group}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{donation.units_donated} Units</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center space-x-1 text-white px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                                                donation.status === 'Completed' ? 'bg-green-600' : 
                                                donation.status === 'Pending' ? 'bg-amber-500' : 'bg-gray-500'
                                            }`}>
                                                {donation.status === 'Completed' && (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                                <span>{donation.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {/* FIXED: Edit Link */}
                                                <Link 
                                                    href={`/donations/${donation.id}/edit`}
                                                    className="inline-block text-blue-500 border border-blue-300 hover:bg-blue-50 p-1.5 rounded transition-colors" 
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                {/* FIXED: Delete Button with onClick event */}
                                                <button 
                                                    onClick={() => handleDelete(donation.id)}
                                                    className="text-red-500 border border-red-300 hover:bg-red-50 p-1.5 rounded transition-colors" 
                                                    title="Delete"
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
        </AuthenticatedLayout>
    );
}