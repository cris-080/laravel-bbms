import React from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ user }) {
    const {
        data: profileData,
        setData: setProfileData,
        patch,
        errors: profileErrors,
        processing: profileProcessing,
        recentlySuccessful: profileSuccessful,
    } = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        errors: passwordErrors,
        processing: passwordProcessing,
        reset: resetPassword,
        recentlySuccessful: passwordSuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        patch('/profile', {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword('/profile/password', {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <AuthenticatedLayout title="Account Profile">
            <Head title="Profile" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Account Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your account profile details and login password.
                    </p>
                </div>

                {/* Profile Information Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Update your account display name and email address.
                    </p>

                    <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData('name', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                required
                            />
                            {profileErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData('email', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                required
                            />
                            {profileErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={profileProcessing}
                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:opacity-50"
                            >
                                {profileProcessing ? 'Saving...' : 'Save Changes'}
                            </button>
                            {profileSuccessful && (
                                <span className="text-sm text-green-600 font-medium">Saved.</span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Password Update Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Update Password</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Ensure your account uses a strong password to maintain security.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                required
                            />
                            {passwordErrors.current_password && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData('password', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                required
                            />
                            {passwordErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                required
                            />
                            {passwordErrors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={passwordProcessing}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50"
                            >
                                {passwordProcessing ? 'Updating...' : 'Update Password'}
                            </button>
                            {passwordSuccessful && (
                                <span className="text-sm text-green-600 font-medium">Password updated.</span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}