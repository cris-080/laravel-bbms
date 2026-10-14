import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';

export default function Login() {
    const { auth, status } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    
    // Automatically show the popup modal if a status exists
    const [showSuccessModal, setShowSuccessModal] = useState(!!status);

    // Prevent access if authenticated or if restored via back button history
    useEffect(() => {
        if (auth?.user) {
            window.location.replace('/dashboard');
            return;
        }

        // Verify fresh server session in case browser restored a stale guest snapshot
        router.reload({
            only: ['auth'],
            onSuccess: (page) => {
                if (page.props.auth?.user) {
                    window.location.replace('/dashboard');
                }
            },
        });
    }, [auth]);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            replace: true,
        });
    };

    return (
        <>
            <Head title="Sign In — Blood Bank Management System" />

            <div className="min-h-screen flex flex-col lg:flex-row bg-white">
                {/* Left Side: System Branding & Information */}
                <div className="relative lg:w-1/2 bg-gradient-to-br from-red-800 via-rose-700 to-red-600 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-md">
                                <svg className="w-7 h-7 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tight text-white uppercase">
                                BBMS <span className="text-red-200 text-sm font-semibold">Portal</span>
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 my-auto py-10 lg:py-0">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                            Blood Bank Management System
                        </h1>
                        <p className="mt-4 text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-lg">
                            Centralized blood inventory monitoring, donation tracking, donor eligibility verification, and expedited hospital requisition releases.
                        </p>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-white/15 text-xs text-rose-200 flex items-center gap-2">
                        <svg className="w-4 h-4 text-rose-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Protected Clinical Network • Authorized Medical Staff Access Only</span>
                    </div>
                </div>

                {/* Right Side: Clean Login Form */}
                <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-14 lg:p-20 bg-white">
                    <div className="w-full max-w-sm space-y-8">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                Sign In
                            </h2>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                Enter your registered credentials to access your session.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Email Address
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
                                        autoComplete="username"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="user@bloodbank.org"
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

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none text-gray-900 font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{errors.password}</span>
                                    </p>
                                )}
                            </div>

                            {/* Remember Session & Forgot Password Link */}
                            <div className="flex items-center justify-between pt-1">
                                <label htmlFor="remember" className="flex items-center space-x-2.5 cursor-pointer">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500/20 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="text-xs font-semibold text-gray-600">Keep me signed in</span>
                                </label>

                                <a href="/forgot-password" className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to System</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Popup Modal */}
            <Modal closeable={true} onClose={() => setShowSuccessModal(false)} maxWidth="sm" show={showSuccessModal}>
                <div className="p-8 text-center bg-white rounded-2xl">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-sm border border-emerald-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Success!</h3>
                    
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                        {status || "Your password has been successfully reset."}
                    </p>

                    <div className="mt-8">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full inline-flex justify-center items-center rounded-xl shadow-sm px-4 py-3 bg-gray-900 text-sm font-bold text-white hover:bg-gray-800 transition-colors"
                        >
                            Continue to Login
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}