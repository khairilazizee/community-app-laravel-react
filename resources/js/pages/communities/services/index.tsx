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

type Service = {
    id: number;
    name: string;
    description: string | null;
};

type Props = {
    community: Community;
    services: Service[];
};

export default function ServicesIndex({ community, services }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Services', href: '' },
    ];
    const { delete: destroy } = useForm();

    const handleDelete = (serviceId: number) => {
        destroy(`/communities/${community.id}/services/${serviceId}`, {
            onSuccess: () => toast.success('Service deleted.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Services in {community.name}
                    </h1>
                    <Link href={`/communities/${community.id}/services/create`}>
                        <Button>Add Service</Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {services.map((service) => (
                        <Card key={service.id}>
                            <CardHeader>
                                <CardTitle>{service.name}</CardTitle>
                                <CardDescription>Service</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {service.description || 'No description.'}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={`/communities/${community.id}/services/${service.id}/edit`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(service.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {services.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                            No services yet.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
