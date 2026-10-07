import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        age: '',
        sex: '',
        blood_group: '',
        contact_number: '',
        address: '',
        last_donation_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/donors');
    };

    return (
        <AuthenticatedLayout title="Add Donor">
            <Head title="Add Donor" />

            <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Add New Donor
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter the donor's personal and blood information.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Age
                            </label>

                            <input
                                type="number"
                                value={data.age}
                                onChange={(e) => setData('age', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.age && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.age}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Sex
                            </label>

                            <select
                                value={data.sex}
                                onChange={(e) => setData('sex', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            {errors.sex && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.sex}
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
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>

                            {errors.blood_group && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.blood_group}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Contact Number
                            </label>

                            <input
                                type="text"
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData('contact_number', e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.contact_number && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.contact_number}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Address
                            </label>

                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                rows="3"
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Last Donation Date
                            </label>

                            <input
                                type="date"
                                value={data.last_donation_date}
                                onChange={(e) =>
                                    setData(
                                        'last_donation_date',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.last_donation_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.last_donation_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-5">
                        <Link
                            href="/donors"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Donor'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}