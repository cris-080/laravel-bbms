import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ donation, donors }) {
    // Initialize the form with the existing donation data
    const { data, setData, put, processing, errors } = useForm({
        donor_id: donation.donor_id,
        donation_date: donation.donation_date,
        units_donated: donation.units_donated,
        status: donation.status,
    });

    const submit = (e) => {
        e.preventDefault();
        // Send a PUT request to update the record
        put(`/donations/${donation.id}`);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Donation" />

            <div className="max-w-2xl mx-auto pb-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Donation Record</h2>
                    <p className="text-sm text-gray-500">Modifying status or units will automatically recalculate inventory.</p>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Donor Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Donor</label>
                            <select 
                                value={data.donor_id} 
                                onChange={e => setData('donor_id', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                            >
                                <option value="">-- Choose a Registered Donor --</option>
                                {donors.map(donor => (
                                    <option key={donor.id} value={donor.id}>
                                        {donor.name} ({donor.blood_group})
                                    </option>
                                ))}
                            </select>
                            {errors.donor_id && <p className="text-red-500 text-xs mt-1">{errors.donor_id}</p>}
                        </div>

                        {/* Date and Units row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Donation Date</label>
                                <input 
                                    type="date" 
                                    value={data.donation_date} 
                                    onChange={e => setData('donation_date', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                />
                                {errors.donation_date && <p className="text-red-500 text-xs mt-1">{errors.donation_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Units Collected</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={data.units_donated} 
                                    onChange={e => setData('units_donated', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                />
                                {errors.units_donated && <p className="text-red-500 text-xs mt-1">{errors.units_donated}</p>}
                            </div>
                        </div>

                        {/* Status Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Status</label>
                            <select 
                                value={data.status} 
                                onChange={e => setData('status', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                            >
                                <option value="Completed">Completed (Automatically Updates Stock)</option>
                                <option value="Pending">Pending (Awaiting Collection)</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                        </div>

                        <hr className="my-4" />

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3">
                            <Link 
                                href="/donations" 
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-red-600 text-white px-5 py-2 rounded-md shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                                {processing ? 'Updating...' : 'Update Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}