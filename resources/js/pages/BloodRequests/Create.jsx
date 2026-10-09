import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ inventory }) {
    const { data, setData, post, processing, errors } = useForm({
        physician_name: '',
        patient_name: '',
        blood_group: '',
        units_needed: '',
    });

    const selectedInventory = inventory.find(
        (item) => item.blood_group === data.blood_group
    );

    const submit = (e) => {
        e.preventDefault();
        post('/blood-requests');
    };

    return (
        <AuthenticatedLayout title="New Blood Request">
            <Head title="New Blood Request" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        New Blood Request
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter the patient and blood requirements.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Patient Name
                        </label>

                        <input
                            type="text"
                            value={data.patient_name}
                            onChange={(e) =>
                                setData('patient_name', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />

                        {errors.patient_name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.patient_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Physician Name
                        </label>

                        <input
                            type="text"
                            value={data.physician_name}
                            onChange={(e) =>
                                setData('physician_name', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />

                        {errors.physician_name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.physician_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Blood Group
                        </label>

                        <select
                            value={data.blood_group}
                            onChange={(e) =>
                                setData('blood_group', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        >
                            <option value="">Select Blood Group</option>

                            {inventory.map((item) => (
                                <option
                                    key={item.blood_group}
                                    value={item.blood_group}
                                >
                                    {item.blood_group} — {item.total_units}{' '}
                                    unit(s) available
                                </option>
                            ))}
                        </select>

                        {errors.blood_group && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.blood_group}
                            </p>
                        )}

                        {selectedInventory && (
                            <p className="mt-2 text-sm text-gray-500">
                                Current stock:{' '}
                                <span className="font-semibold">
                                    {selectedInventory.total_units} unit(s)
                                </span>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Units Needed
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={data.units_needed}
                            onChange={(e) =>
                                setData('units_needed', e.target.value)
                            }
                            className="w-full rounded-lg border-gray-300"
                        />

                        {errors.units_needed && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.units_needed}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-5">
                        <Link
                            href="/blood-requests"
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
                                ? 'Submitting...'
                                : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}