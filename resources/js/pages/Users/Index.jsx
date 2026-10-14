import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ users = { data: [], links: [] } }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Unified Form Hook for Create and Edit
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: 'staff',
        password: '',
        password_confirmation: '',
    });

    // KPI Metrics calculation
    const totalUsers = users.total ?? users.data?.length ?? 0;
    const adminCount = users.data?.filter((u) => u.roles?.some((r) => r.name === 'admin')).length ?? 0;
    const staffCount = users.data?.filter((u) => u.roles?.some((r) => r.name === 'staff')).length ?? 0;

    // Filter users by search term and role
    const filteredUsers = (users.data || []).filter((user) => {
        const query = searchTerm.toLowerCase();
        const matchesQuery =
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query);
        const userRole = user.roles?.[0]?.name || 'staff';
        const matchesRole = roleFilter === '' || userRole === roleFilter;

        return matchesQuery && matchesRole;
    });

    // Modal Handlers
    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setData({
            name: '',
            email: '',
            role: 'staff',
            password: '',
            password_confirmation: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        clearErrors();
        setData({
            name: user.name || '',
            email: user.email || '',
            role: user.roles?.[0]?.name || 'staff',
            password: '',
            password_confirmation: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
        clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post('/users', {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteUser = (user) => {
        if (user.id === auth?.user?.id) {
            alert('You cannot delete your own account.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            router.delete(`/users/${user.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout title="Manage Users">
            <Head title="User & Role Management" />

            <div className="max-w-7xl mx-auto space-y-6 pb-10">
                {/* Header & Primary Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                User & Role Management
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage staff user credentials, RBAC permissions, and administration accounts.
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
                        <span>Add New User</span>
                    </button>
                </div>

                {/* Metrics / KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Accounts</p>
                            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalUsers}</p>
                        </div>
                        <span className="p-2.5 bg-gray-100 rounded-lg text-gray-600 text-sm font-semibold">
                            Users
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administrators</p>
                            <p className="text-xl font-bold text-purple-600 mt-0.5">{adminCount}</p>
                        </div>
                        <span className="p-2.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold">
                            Admins
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Clinical Staff</p>
                            <p className="text-xl font-bold text-blue-600 mt-0.5">{staffCount}</p>
                        </div>
                        <span className="p-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                            Staff
                        </span>
                    </div>
                </div>

                {/* Search & Role Filter Toolbar */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/80">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 max-w-md">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search by name or email address..."
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

                        <div className="flex items-center gap-3">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium text-gray-700"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Administrators</option>
                                <option value="staff">Clinical Staff</option>
                            </select>

                            {(searchTerm || roleFilter) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setRoleFilter('');
                                    }}
                                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm divide-y divide-gray-200">
                            <thead className="bg-gray-50/75 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5">User Profile</th>
                                    <th className="px-6 py-3.5">Email Address</th>
                                    <th className="px-6 py-3.5">Assigned Role</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
                                        const role = user.roles?.[0]?.name || 'staff';
                                        const isCurrentUser = user.id === auth?.user?.id;

                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-100 shrink-0">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-semibold text-gray-900 leading-tight">
                                                                    {user.name}
                                                                </span>
                                                                {isCurrentUser && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-0.5">
                                                                User ID #{user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-gray-700 font-medium">
                                                    {user.email}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                            role === 'admin'
                                                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                                                            }`}
                                                        />
                                                        {role}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                                                            title="Edit User"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => deleteUser(user)}
                                                            disabled={isCurrentUser}
                                                            className={`p-1.5 rounded-lg border transition-colors ${
                                                                isCurrentUser
                                                                    ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                                                    : 'text-red-600 hover:bg-red-50 border-red-200'
                                                            }`}
                                                            title={isCurrentUser ? 'Cannot delete current account' : 'Delete User'}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-3 bg-gray-100 rounded-full text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium text-sm">No users found</p>
                                                <p className="text-gray-400 text-xs">Try adjusting your search criteria or register a new user.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/50">
                            <span className="text-xs text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{users.data?.length}</span> users on this page
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {users.links.map((link, index) => (
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
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
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
                                        {editingUser ? 'Edit User Account' : 'Add New User Account'}
                                    </h2>
                                    <p className="text-xs text-red-100 mt-0.5">
                                        {editingUser
                                            ? 'Update credentials, name, or change Spatie system permissions'
                                            : 'Create a staff or administrator profile with portal access'}
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
                        {/* Name Field */}
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
                                    placeholder="e.g. Maria Santos"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
                        </div>

                        {/* Email & Role Fields */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    Email Address <span className="text-red-500">*</span>
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
                                        placeholder="staff@bloodbank.org"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                    System Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium text-gray-800"
                                >
                                    <option value="staff">Staff (Operational & Log Access)</option>
                                    <option value="admin">Admin (Full System & User Control)</option>
                                </select>
                                {errors.role && <p className="mt-1 text-xs text-red-600 font-medium">{errors.role}</p>}
                            </div>
                        </div>

                        {/* Password Fields */}
                        <div className="pt-2 border-t border-gray-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                                Security Credentials
                            </span>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        {editingUser ? 'New Password' : 'Password'} {!editingUser && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        />
                                    </div>
                                    {editingUser && (
                                        <p className="mt-1 text-[11px] text-gray-400">Leave blank to retain current password.</p>
                                    )}
                                    {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                                        Confirm Password {!editingUser && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        />
                                    </div>
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
                                        <span>{editingUser ? 'Update Account' : 'Save Account'}</span>
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