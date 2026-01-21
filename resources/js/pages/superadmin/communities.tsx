import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Communitites List',
        href: '/superadmin/communities',
    },
];

type Community = {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_private: boolean;
    members_count: number;
    deleted_at?: string | null;
};

type Props = {
    activeCommunities: Community[];
    deletedCommunities: Community[];
};

export default function Dashboard({
    activeCommunities,
    deletedCommunities,
}: Props) {
    const [activeTab, setActiveTab] = useState<'active' | 'deleted'>(
        'active',
    );
    const communities =
        activeTab === 'active' ? activeCommunities : deletedCommunities;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Communities List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="inline-flex w-fit gap-1 rounded-lg bg-neutral-100 p-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('active')}
                        className={`rounded-md px-3.5 py-1.5 text-sm transition-colors ${
                            activeTab === 'active'
                                ? 'bg-white shadow-xs'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black'
                        }`}
                    >
                        Available
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('deleted')}
                        className={`rounded-md px-3.5 py-1.5 text-sm transition-colors ${
                            activeTab === 'deleted'
                                ? 'bg-white shadow-xs'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black'
                        }`}
                    >
                        Deleted
                    </button>
                </div>
                <Table>
                    {/* <TableCaption>Communities List</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Is Private</TableHead>
                            <TableHead>Members</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {communities.map((community) => {
                            return (
                                <TableRow key={community.id}>
                                    <TableCell>{community.name}</TableCell>
                                    <TableCell>{community.slug}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                community.is_private
                                                    ? 'destructive'
                                                    : 'secondary'
                                            }
                                        >
                                            {community.is_private
                                                ? 'Private'
                                                : 'Public'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {community.members_count}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {communities.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    {activeTab === 'active'
                                        ? 'No available communities found'
                                        : 'No deleted communities found'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
