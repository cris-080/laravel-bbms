import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const url = usePage().url;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const NavLink = ({ href, active, children, icon }) => (
        <Link 
            href={href} 
            className={`flex items-center px-6 py-3 text-sm transition-colors ${
                active 
                ? 'bg-red-50 text-red-600 border-l-4 border-red-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
            }`}
        >
            <span className="w-5 h-5 mr-3">{icon}</span>
            {children}
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans text-gray-900">
            {/* White Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-red-600 text-2xl mr-2">🩸</span>
                    <span className="text-lg font-bold tracking-tight text-gray-900">BBMS</span>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-4">
                    <NavLink href="/dashboard" active={url.startsWith('/dashboard')} icon="📊">Dashboard</NavLink>
                    <NavLink href="/donors" active={url.startsWith('/donors')} icon="👥">Donors</NavLink>
                    <NavLink href="/blood-requests" active={url.startsWith('/blood-requests')} icon="🏥">Blood Requests</NavLink>
                    <NavLink href="/donations" active={url.startsWith('/donations')} icon="💧">Blood Donation</NavLink>
                    <NavLink href="/inventory" active={url.startsWith('/inventory')} icon="📈">Blood Inventory</NavLink>
                    <NavLink href="/schedules" active={url.startsWith('/schedules')} icon="📅">Schedule</NavLink>
                    <NavLink href="/history" active={url.startsWith('/history')} icon="🕒">Donation History</NavLink>
                    <NavLink href="/audit-logs" active={url.startsWith('/audit-logs')} icon="📄">Audit Log</NavLink>
                    <NavLink href="/users" active={url.startsWith('/users')} icon="👤">Users</NavLink>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 px-6 flex justify-between items-center z-10">
                    <div className="flex items-center">
                        <button className="text-gray-500 hover:text-gray-700 focus:outline-none mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">Blood Bank Management System</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="text-right flex flex-col justify-center">
                            <span className="text-sm font-bold text-gray-900 leading-tight">{auth.user.name}</span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{auth.roles[0]}</span>
                        </div>
                        {/* Circular Avatar Badge */}
                        <div className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}