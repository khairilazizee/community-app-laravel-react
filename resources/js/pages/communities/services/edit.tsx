import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

type Community = {
    id: number;
    name: string;
};

type Service = {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    owner_id: number | null;
    offerings: {
        id: number;
        name: string;
        price: number | null;
        duration_minutes: number | null;
        description: string | null;
        sort_order: number;
        category: {
            name: string;
        } | null;
    }[];
};

type Member = {
    id: number;
    role: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

type Props = {
    community: Community;
    service: Service;
    members: Member[];
    can_edit_fields: boolean;
    can_change_owner: boolean;
};

export default function ServicesEdit({
    community,
    service,
    members,
    can_edit_fields,
    can_change_owner,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Services', href: `/communities/${community.id}/services` },
        { title: service.name, href: '' },
    ];
    const defaultOwnerId =
        members.find((member) => member.role === 'admin')?.user.id ??
        members[0]?.user.id ??
        null;
    const { data, setData, put, processing } = useForm({
        name: service.name,
        description: service.description ?? '',
        address: service.address ?? '',
        city: service.city ?? '',
        state: service.state ?? '',
        zip: service.zip ?? '',
        country: service.country ?? '',
        owner_id: service.owner_id ?? defaultOwnerId,
        service_offerings: service.offerings?.map((offering) => ({
            name: offering.name,
            price: offering.price ?? '',
            duration_minutes: offering.duration_minutes ?? '',
            category: offering.category?.name ?? '',
            description: offering.description ?? '',
            sort_order: offering.sort_order ?? 0,
        })) ?? [],
    });

    const toNumberOrNull = (value: string | number | null) => {
        if (value === '' || value === null) return null;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? null : parsed;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/communities/${community.id}/services/${service.id}`, {
            onSuccess: () => toast.success('Service updated.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    const updateOffering = (
        index: number,
        key:
            | 'name'
            | 'price'
            | 'duration_minutes'
            | 'category'
            | 'description'
            | 'sort_order',
        value: string | number,
    ) => {
        const nextOfferings = [...data.service_offerings];
        nextOfferings[index] = { ...nextOfferings[index], [key]: value };
        setData('service_offerings', nextOfferings);
    };

    const addOffering = () => {
        setData('service_offerings', [
            ...data.service_offerings,
            {
                name: '',
                price: '',
                duration_minutes: '',
                category: '',
                description: '',
                sort_order: 0,
            },
        ]);
    };

    const removeOffering = (index: number) => {
        const nextOfferings = data.service_offerings.filter(
            (_, i) => i !== index,
        );
        setData('service_offerings', nextOfferings);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${service.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    disabled={!can_edit_fields}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    disabled={!can_edit_fields}
                                />
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <Label>Address</Label>
                                    <Input
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        disabled={!can_edit_fields}
                                    />
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <Input
                                        value={data.city}
                                        onChange={(e) =>
                                            setData('city', e.target.value)
                                        }
                                        disabled={!can_edit_fields}
                                    />
                                </div>
                                <div>
                                    <Label>State</Label>
                                    <Input
                                        value={data.state}
                                        onChange={(e) =>
                                            setData('state', e.target.value)
                                        }
                                        disabled={!can_edit_fields}
                                    />
                                </div>
                                <div>
                                    <Label>Zip</Label>
                                    <Input
                                        value={data.zip}
                                        onChange={(e) =>
                                            setData('zip', e.target.value)
                                        }
                                        disabled={!can_edit_fields}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Country</Label>
                                    <Input
                                        value={data.country}
                                        onChange={(e) =>
                                            setData('country', e.target.value)
                                        }
                                        disabled={!can_edit_fields}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label>Service Offerings</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addOffering}
                                        disabled={!can_edit_fields}
                                    >
                                        Add Offering
                                    </Button>
                                </div>
                                <div className="mt-2 space-y-3">
                                    {data.service_offerings.map(
                                        (offering, index) => (
                                            <div
                                                key={index}
                                                className="rounded-md border border-border p-3"
                                            >
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    <div>
                                                        <Label>Name</Label>
                                                        <Input
                                                            value={
                                                                offering.name
                                                            }
                                                            onChange={(e) =>
                                                                updateOffering(
                                                                    index,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !can_edit_fields
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Category</Label>
                                                        <Input
                                                            value={
                                                                offering.category
                                                            }
                                                            onChange={(e) =>
                                                                updateOffering(
                                                                    index,
                                                                    'category',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !can_edit_fields
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Price</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={
                                                                offering.price
                                                            }
                                                            onChange={(e) =>
                                                                updateOffering(
                                                                    index,
                                                                    'price',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !can_edit_fields
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>
                                                            Duration (minutes)
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={
                                                                offering.duration_minutes
                                                            }
                                                            onChange={(e) =>
                                                                updateOffering(
                                                                    index,
                                                                    'duration_minutes',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !can_edit_fields
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>
                                                            Sort Order
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={
                                                                offering.sort_order
                                                            }
                                                            onChange={(e) =>
                                                                updateOffering(
                                                                    index,
                                                                    'sort_order',
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            disabled={
                                                                !can_edit_fields
                                                            }
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label>
                                                            Description
                                                        </Label>
                                                        <Input
                                                            value={
                                                                offering.description
                                                            }
                                                            onChange={(e) =>
                                                                updateOffering(
                                                                    index,
                                                                    'description',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={
                                                                !can_edit_fields
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            removeOffering(
                                                                index,
                                                            )
                                                        }
                                                        disabled={
                                                            !can_edit_fields
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label>Owner</Label>
                                <select
                                    className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                                    value={data.owner_id ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            'owner_id',
                                            toNumberOrNull(e.target.value),
                                        )
                                    }
                                    disabled={!can_change_owner}
                                >
                                    {members.length === 0 && (
                                        <option value="">
                                            Default (Admin)
                                        </option>
                                    )}
                                    {members.map((member) => (
                                        <option
                                            key={member.id}
                                            value={member.user.id}
                                        >
                                            {member.user.name} ({member.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/communities/${community.id}/edit`}
                                >
                                    <Button variant="outline" type="button">
                                        Back
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
