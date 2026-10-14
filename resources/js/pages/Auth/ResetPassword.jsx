import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function ResetPassword({ email, token }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <>
            <Head title="Reset Password — Blood Bank Management System" />

            {/* Background: Blurred Login Screen Illusion */}
            <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100 fixed inset-0 z-0">
                <div className="relative lg:w-1/2 bg-gradient-to-br from-red-800 via-rose-700 to-red-600 opacity-30 blur-sm"></div>
                <div className="lg:w-1/2 bg-white opacity-40 blur-sm"></div>
            </div>

            {/* The Pop-out Modal */}
            <Modal show={true} maxWidth="md" closeable={false}>
                <div className="p-8 sm:p-10 relative bg-white overflow-hidden">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600 mb-4 border border-red-100 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Create New Password
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            Please enter your new secure password below to restore access to your account.
                        </p>
                    </div>

                   {Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700 flex items-start gap-3 shadow-sm animate-pulse">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <span className="block mb-0.5">Password Reset Failed</span>
                            <span className="text-xs font-medium text-red-600">{errors.email || errors.password || 'Invalid reset request.'}</span>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                        {/* Email Input (Read-only for security confirmation) */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Account Email
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    readOnly
                                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none text-gray-900 font-medium"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </span>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none text-gray-900 font-medium"
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all disabled:opacity-50"
                            >
                                {processing ? 'Updating Password...' : 'Save & Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}