import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Stats = {
    businesses: number;
    posts: number;
    news: number;
    services: number;
    members: number;
    comments: number;
};

export default function Dashboard({ stats }: { stats: Stats }) {
    const items = [
        { label: 'Businesses', value: stats.businesses },
        { label: 'Services', value: stats.services },
        { label: 'Posts', value: stats.posts },
        { label: 'News', value: stats.news },
        { label: 'Members', value: stats.members },
        { label: 'Comments', value: stats.comments },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {items.map((item) => (
                        <Card key={item.label}>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {item.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-semibold">
                                    {item.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
