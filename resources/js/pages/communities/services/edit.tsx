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
    owner_id: number | null;
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
};

export default function ServicesEdit({ community, service, members }: Props) {
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
        owner_id: service.owner_id ?? defaultOwnerId,
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
