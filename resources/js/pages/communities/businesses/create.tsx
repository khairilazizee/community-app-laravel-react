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
    members: Member[];
};

export default function BusinessesCreate({ community, members }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Businesses', href: `/communities/${community.id}/businesses` },
        { title: 'Add', href: '' },
    ];
    const defaultOwnerId =
        members.find((member) => member.role === 'admin')?.user.id ??
        members[0]?.user.id ??
        null;
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const { data, setData, post, processing } = useForm({
        name: '',
        type: 'business',
        description: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        owner_id: defaultOwnerId as number | null,
        business_items: [
            { name: '', price: '', category: '', description: '', sort_order: 0 },
        ],
        business_hours: dayLabels.map((_, index) => ({
            day_of_week: index,
            open_time: '',
            close_time: '',
            is_closed: false,
        })),
    });

    const toNumberOrNull = (value: string | number | null) => {
        if (value === '' || value === null) return null;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? null : parsed;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/communities/${community.id}/businesses`, {
            onSuccess: () => toast.success('Business created.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    const updateItem = (
        index: number,
        key: 'name' | 'price' | 'category' | 'description' | 'sort_order',
        value: string | number,
    ) => {
        const nextItems = [...data.business_items];
        nextItems[index] = { ...nextItems[index], [key]: value };
        setData('business_items', nextItems);
    };

    const addItem = () => {
        setData('business_items', [
            ...data.business_items,
            { name: '', price: '', category: '', description: '', sort_order: 0 },
        ]);
    };

    const removeItem = (index: number) => {
        const nextItems = data.business_items.filter((_, i) => i !== index);
        setData('business_items', nextItems.length ? nextItems : []);
    };

    const updateHour = (
        index: number,
        key: 'open_time' | 'close_time' | 'is_closed',
        value: string | boolean,
    ) => {
        const nextHours = [...data.business_hours];
        nextHours[index] = { ...nextHours[index], [key]: value };
        setData('business_hours', nextHours);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Business" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Business</CardTitle>
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
                                />
                            </div>
                            <div>
                                <Label>Type</Label>
                                <Input
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
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
                                    />
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <Input
                                        value={data.city}
                                        onChange={(e) =>
                                            setData('city', e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>State</Label>
                                    <Input
                                        value={data.state}
                                        onChange={(e) =>
                                            setData('state', e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Zip</Label>
                                    <Input
                                        value={data.zip}
                                        onChange={(e) =>
                                            setData('zip', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Country</Label>
                                    <Input
                                        value={data.country}
                                        onChange={(e) =>
                                            setData('country', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Business Hours</Label>
                                <div className="mt-2 space-y-2">
                                    {data.business_hours.map((hour, index) => (
                                        <div
                                            key={hour.day_of_week}
                                            className="flex flex-wrap items-center gap-2"
                                        >
                                            <div className="w-12 text-sm font-medium">
                                                {dayLabels[index]}
                                            </div>
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={hour.is_closed}
                                                    onChange={(e) =>
                                                        updateHour(
                                                            index,
                                                            'is_closed',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                                Closed
                                            </label>
                                            <Input
                                                type="time"
                                                value={hour.open_time}
                                                onChange={(e) =>
                                                    updateHour(
                                                        index,
                                                        'open_time',
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={hour.is_closed}
                                                className="w-36"
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                to
                                            </span>
                                            <Input
                                                type="time"
                                                value={hour.close_time}
                                                onChange={(e) =>
                                                    updateHour(
                                                        index,
                                                        'close_time',
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={hour.is_closed}
                                                className="w-36"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label>Items / Products</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addItem}
                                    >
                                        Add Item
                                    </Button>
                                </div>
                                <div className="mt-2 space-y-3">
                                    {data.business_items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="rounded-md border border-border p-3"
                                        >
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div>
                                                    <Label>Name</Label>
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Category</Label>
                                                    <Input
                                                        value={item.category}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'category',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Price</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.price}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'price',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Sort Order</Label>
                                                    <Input
                                                        type="number"
                                                        value={item.sort_order}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'sort_order',
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Description</Label>
                                                    <Input
                                                        value={item.description}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'description',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
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
