import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ inventory }) {
    // Dynamically calculate the total units across all blood groups for the top-right badge
    const totalBankUnits = inventory.reduce((sum, item) => sum + item.total_units, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Live Blood Inventory" />

            <div className="max-w-7xl mx-auto pb-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Live Blood Inventory</h2>
                        <p className="text-sm text-gray-500">Current available stock ready for dispensing.</p>
                    </div>
                    
                    {/* Dark Pill: Total Bank Units */}
                    <div className="bg-gray-900 text-white px-5 py-2.5 rounded-full flex items-center space-x-3 shadow-md">
                        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                        <span className="font-medium text-sm">Total Bank Units:</span>
                        <span className="font-bold text-lg">{totalBankUnits}</span>
                    </div>
                </div>

                {/* Blood Group Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {inventory.map((item) => (
                        <div key={item.id} className="bg-red-50/50 border border-red-200 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            
                            {/* Top Row: Blood Type Badge & Status */}
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-red-600 text-white font-bold text-sm px-3 py-1 rounded-full shadow-sm">
                                    {item.blood_group}
                                </span>
                                
                                {/* Status Indicator (Dynamically changes based on stock) */}
                                <div className={`flex items-center space-x-1 text-xs font-bold ${item.total_units <= 4 ? 'text-red-500' : 'text-emerald-600'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h4l2 -4 4 10 2 -6h5" />
                                    </svg>
                                    <span>{item.total_units <= 4 ? 'Low Stock' : 'Healthy'}</span>
                                </div>
                            </div>

                            {/* Center Row: Blood Drop & Unit Count */}
                            <div className="flex flex-col items-center justify-center py-3">
                                <svg className="w-10 h-10 text-red-600 mb-2 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>
                                <span className="text-5xl font-extrabold text-gray-900 leading-none mb-1">
                                    {item.total_units}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                    Units Available
                                </span>
                            </div>

                            {/* Bottom Row: Schedule Action Button */}
                            <Link 
                                href="/schedules" 
                                className="mt-4 w-full flex items-center justify-center space-x-2 border border-red-400 text-red-500 hover:bg-red-50 hover:border-red-500 rounded-full py-2 text-sm transition-colors font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Schedule Donors</span>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Info Calculation Banner */}
                <div className="mt-8 bg-blue-50/80 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                    <div className="bg-[#1e3a8a] text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold font-serif italic">i</span>
                    </div>
                    <p className="text-sm text-[#1e3a8a]">
                        <span className="font-bold">How is this calculated?</span> The inventory automatically takes your total collected blood and subtracts any blood requests that have been marked as <span className="italic">Approved</span> or <span className="italic">Handed Over</span>.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}