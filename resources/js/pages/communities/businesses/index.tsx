import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

type Community = {
    id: number;
    name: string;
};

type Business = {
    id: number;
    name: string;
    type: string;
    description: string | null;
};

type Props = {
    community: Community;
    businesses: Business[];
};

export default function BusinessesIndex({ community, businesses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Businesses', href: '' },
    ];
    const { delete: destroy } = useForm();

    const handleDelete = (businessId: number) => {
        destroy(`/communities/${community.id}/businesses/${businessId}`, {
            onSuccess: () => toast.success('Business deleted.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Businesses" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Businesses in {community.name}
                    </h1>
                    <Link href={`/communities/${community.id}/businesses/create`}>
                        <Button>Add Business</Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {businesses.map((business) => (
                        <Card key={business.id}>
                            <CardHeader>
                                <CardTitle>{business.name}</CardTitle>
                                <CardDescription>
                                    {business.type || 'Business'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {business.description || 'No description.'}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={`/communities/${community.id}/businesses/${business.id}/edit`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(business.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {businesses.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                            No businesses yet.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
