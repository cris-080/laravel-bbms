import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash } = usePage().props;
    const url = usePage().url;
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const confirmLogout = (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    router.post('/logout', {}, {
        replace: true,
        onFinish: () => setIsLoggingOut(false),
    });
};

    const NavLink = ({ href, active, children, icon: Icon }) => (
        <Link
            href={href}
            className={`group flex items-center px-3.5 py-2.5 mx-3 rounded-xl text-sm font-medium transition-all ${
                active
                    ? 'bg-red-50 text-red-700 shadow-sm shadow-red-100 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            <span
                className={`w-5 h-5 mr-3 shrink-0 transition-colors ${
                    active ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'
                }`}
            >
                <Icon />
            </span>
            <span className="truncate">{children}</span>
            {active && (
                <span className="ml-auto w-1.5 h-4 rounded-full bg-red-600 shrink-0" />
            )}
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-100/80 flex font-sans text-gray-900">
            {/* Enhanced Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col z-20 shrink-0 shadow-sm">
                {/* Brand / Logo Banner */}
                <div className="h-16 flex items-center px-5 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-red-500/20 mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-base font-extrabold tracking-tight text-gray-900">
                            BBMS 
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                            Blood Bank System
                        </span>
                    </div>
                </div>

                {/* Nav Links Directory */}
                <nav className="flex-1 overflow-y-auto py-4 space-y-6">
                    {/* Operations Section */}
                    <div>
                        <div className="px-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Main Operations
                        </div>
                        <div className="space-y-1">
                            <NavLink
                                href="/dashboard"
                                active={url.startsWith('/dashboard')}
                                icon={DashboardIcon}
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                href="/donors"
                                active={url.startsWith('/donors')}
                                icon={DonorsIcon}
                            >
                                Donors
                            </NavLink>
                            <NavLink
                                href="/blood-requests"
                                active={url.startsWith('/blood-requests')}
                                icon={BloodRequestsIcon}
                            >
                                Blood Requests
                            </NavLink>
                            <NavLink
                                href="/donations"
                                active={url.startsWith('/donations')}
                                icon={DonationsIcon}
                            >
                                Blood Donations
                            </NavLink>
                            <NavLink
                                href="/inventory"
                                active={url.startsWith('/inventory')}
                                icon={InventoryIcon}
                            >
                                Blood Inventory
                            </NavLink>
                            <NavLink
                                href="/schedules"
                                active={url.startsWith('/schedules')}
                                icon={ScheduleIcon}
                            >
                                Schedules
                            </NavLink>
                        </div>
                    </div>

                    {/* Administration Section */}
                    {auth.roles?.includes('admin') && (
                        <div>
                            <div className="px-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Administration
                            </div>
                            <div className="space-y-1">
                                <NavLink
                                    href="/audit-logs"
                                    active={url.startsWith('/audit-logs')}
                                    icon={AuditIcon}
                                >
                                    Audit Logs
                                </NavLink>
                                <NavLink
                                    href="/users"
                                    active={url.startsWith('/users')}
                                    icon={UsersIcon}
                                >
                                    Users & Roles
                                </NavLink>
                            </div>
                        </div>
                    )}
                </nav>

                
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex justify-between items-center z-10 shrink-0">
                    <div className="flex items-center">
                        <h1 className="text-sm font-bold tracking-tight text-gray-700">
                            Blood Bank Information System
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                            href="/profile"
                        >
                            <div className="text-right hidden sm:flex flex-col justify-center">
                                <span className="text-xs font-bold text-gray-900 leading-tight">
                                    {auth.user.name}
                                </span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                                    {auth.roles?.[0]}
                                </span>
                            </div>
                            <div className="h-8 w-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                        </Link>

                        <div className="h-5 w-px bg-gray-200"></div>

                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {flash?.success && (
                        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-xs">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 flex items-center justify-between shadow-xs">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {children}
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal show={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <h3 className="text-base font-bold text-gray-900">
                            Confirm Sign Out
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                            Are you sure you want to log out of your account? You will need your credentials to access the blood management system again.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="w-full px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmLogout}
                            disabled={isLoggingOut}
                            className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.99] rounded-xl shadow-sm transition-all disabled:opacity-50"
                        >
                            {isLoggingOut ? 'Signing out...' : 'Yes, Sign Out'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

// Icon Helper Components
function DashboardIcon() {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    );
}

function DonorsIcon() {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function BloodRequestsIcon() {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function DonationsIcon() {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
    );
}

function InventoryIcon() {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function ScheduleIcon() {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function AuditIcon() {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}