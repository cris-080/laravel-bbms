import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ logs }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8; // Adjust based on preference

    // Format date like "Oct 06, 2026 11:34 PM"
    const formatDateTime = (dateString) => {
        const options = { 
            month: 'short', day: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Client-side search filtering
    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();
        return (
            (log.user?.name || '').toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search) ||
            log.details.toLowerCase().includes(search)
        );
    });

    // Client-side Pagination Logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredLogs.length / recordsPerPage) || 1;

    // Generate pagination numbers (simplified for demo)
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <AuthenticatedLayout>
            <Head title="System Audit Logs" />

            <div className="max-w-7xl mx-auto pb-8">
                {/* Header Section */}
                <div className="mb-6 flex items-center space-x-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">System Audit Logs</h2>
                        <p className="text-sm text-gray-500">Tracking all staff and admin activity within the system.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex w-full md:w-1/3 mb-4 rounded shadow-sm border border-gray-200">
                    <input 
                        type="text" 
                        placeholder="Search Records..." 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="flex-1 border-none focus:ring-0 text-sm py-2 px-3"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-white shadow-sm border border-gray-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-gray-200 text-gray-900 font-bold">
                            <tr>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500">No system actions recorded yet.</td>
                                </tr>
                            ) : (
                                currentRecords.map(log => (
                                    <tr key={log.id} className="border-b border-gray-100 hover:bg-slate-50">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {formatDateTime(log.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-extrabold text-gray-900">{log.user?.name || 'System'}</div>
                                            {/* Gray role pill */}
                                            <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-1 tracking-wide">
                                                Admin
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Blue action pill */}
                                            <span className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md text-xs font-bold">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Footer */}
                    <div className="flex items-center justify-end px-6 py-3 border-t border-gray-200 bg-gray-50/50">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                                        currentPage === number 
                                        ? 'z-10 bg-blue-600 text-white border-blue-600' 
                                        : 'text-blue-600 bg-white border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}