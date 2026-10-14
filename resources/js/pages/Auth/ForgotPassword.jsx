import { Head, useForm, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { useState, useEffect } from 'react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

 const [showSuccessModal, setShowSuccessModal] = useState(false);
const [statusMessage, setStatusMessage] = useState('');

const submit = (e) => {
    e.preventDefault();
    
    post('/forgot-password', {
        preserveScroll: true,
        onSuccess: (page) => {
            const flashMessage = page.props.status || page.props.flash?.status || "Reset link sent! Check your logs.";
            setStatusMessage(flashMessage);
            setShowSuccessModal(true);
        },
        onError: () => {
            setShowSuccessModal(false);
        }
    });
};
    return (
        <>
            <Head title="Forgot Password — Blood Bank Management System" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-rose-50/40 to-slate-200 p-4 sm:p-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-300/50 border border-gray-100 p-8 sm:p-10 relative z-10">
                    
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600 mb-4 border border-red-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Reset Password
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="user@bloodbank.org"
                                    required
                                    autoFocus
                                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none text-gray-900 font-medium"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Link href="/login" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                                Return to login
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-2.5 px-6 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all disabled:opacity-50"
                            >
                                {processing ? 'Sending...' : 'Email Reset Link'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal closeable={false} maxWidth="sm" show={showSuccessModal}>
                <div className="p-8 text-center bg-white rounded-2xl">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-sm border border-emerald-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Reset Link Sent!</h3>
                    
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                    {statusMessage}
                </p>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-left">
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            <span className="font-bold text-gray-900 block mb-1">Developer Notice:</span> 
                            Because emails are configured to log locally, we have enabled a direct testing link below. In production, users must click the link in their email.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <a 
                            href={`/dev/generate-reset-token?email=${encodeURIComponent(data.email)}`}
                            className="w-full inline-flex justify-center items-center rounded-xl shadow-sm px-4 py-3 bg-red-600 text-sm font-bold text-white hover:bg-red-700 transition-colors"
                        >
                            [Test Mode] Go to Reset Password
                        </a>

                        <Link className="w-full inline-flex justify-center items-center rounded-xl px-4 py-3 bg-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors" href="/login">
                            Return to Login Page
                        </Link>
                    </div>
                </div>
            </Modal>
        </>
    );
}