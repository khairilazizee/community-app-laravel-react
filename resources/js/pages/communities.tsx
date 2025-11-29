import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/communities';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Communities',
        href: '/communities',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Communities" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-end justify-end">
                    <Link href={create()}>
                        <Button variant="default">
                            <PlusIcon className="h-4 w-4" />
                            Community
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
