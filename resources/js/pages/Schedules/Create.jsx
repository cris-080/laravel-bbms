import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ donors }) {
    const { data, setData, post, processing, errors } = useForm({
        donor_id: '',
        appointment_date: '',
        appointment_time: '',
    });

    const selectedDonor = donors.find(
        (donor) => String(donor.id) === String(data.donor_id)
    );

    const submit = (e) => {
        e.preventDefault();
        post('/schedules');
    };

    return (
        <AuthenticatedLayout title="New Donation Schedule">
            <Head title="New Donation Schedule" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        New Donation Schedule
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Schedule a blood donation appointment for a registered donor.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Donor
                        </label>

                        <select
                            value={data.donor_id}
                            onChange={(e) =>
                                setData('donor_id', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        >
                            <option value="">Select Donor</option>

                            {donors.map((donor) => (
                                <option
                                    key={donor.id}
                                    value={donor.id}
                                >
                                    {donor.name} — {donor.blood_group}
                                </option>
                            ))}
                        </select>

                        {errors.donor_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.donor_id}
                            </p>
                        )}

                        {selectedDonor && (
                            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium">
                                        Blood Group:
                                    </span>{' '}
                                    {selectedDonor.blood_group}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Last Donation:
                                    </span>{' '}
                                    {selectedDonor.last_donation_date ||
                                        'No previous donation'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Appointment Date
                        </label>

                        <input
                            type="date"
                            value={data.appointment_date}
                            onChange={(e) =>
                                setData(
                                    'appointment_date',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border-gray-300"
                        />

                        {errors.appointment_date && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.appointment_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Appointment Time
                        </label>

                        <input
                            type="time"
                            value={data.appointment_time}
                            onChange={(e) =>
                                setData(
                                    'appointment_time',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border-gray-300"
                        />

                        {errors.appointment_time && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.appointment_time}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-5">
                        <Link
                            href="/schedules"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {processing
                                ? 'Saving...'
                                : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}