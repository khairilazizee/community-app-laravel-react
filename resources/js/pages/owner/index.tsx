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
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type Community = {
    id: number;
    name: string;
};

type Business = {
    id: number;
    name: string;
    description: string | null;
    community: Community | null;
};

type Service = {
    id: number;
    name: string;
    description: string | null;
    community: Community | null;
};

type Props = {
    businesses: Business[];
    services: Service[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Owner Dashboard', href: '/owner' },
];

export default function OwnerDashboard({ businesses, services }: Props) {
    const [activeTab, setActiveTab] = useState<'businesses' | 'services'>(
        'businesses',
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Owner Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('businesses')}
                        className={`rounded-full border px-4 py-1.5 text-sm transition ${
                            activeTab === 'businesses'
                                ? 'border-foreground/30 bg-foreground text-background'
                                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                        }`}
                    >
                        Businesses
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('services')}
                        className={`rounded-full border px-4 py-1.5 text-sm transition ${
                            activeTab === 'services'
                                ? 'border-foreground/30 bg-foreground text-background'
                                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                        }`}
                    >
                        Services
                    </button>
                </div>

                {activeTab === 'businesses' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>My Businesses</CardTitle>
                            <CardDescription>
                                Manage the businesses you own.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {businesses.length === 0 && (
                                <p className="text-muted-foreground">
                                    No businesses yet.
                                </p>
                            )}
                            {businesses.map((business) => (
                                <div
                                    key={business.id}
                                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {business.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {business.community?.name ??
                                                'Community'}
                                        </div>
                                    </div>
                                    {business.community && (
                                        <Link
                                            href={`/communities/${business.community.id}/businesses/${business.id}/edit`}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'services' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>My Services</CardTitle>
                            <CardDescription>
                                Manage the services you offer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {services.length === 0 && (
                                <p className="text-muted-foreground">
                                    No services yet.
                                </p>
                            )}
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {service.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {service.community?.name ??
                                                'Community'}
                                        </div>
                                    </div>
                                    {service.community && (
                                        <Link
                                            href={`/communities/${service.community.id}/services/${service.id}/edit`}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
