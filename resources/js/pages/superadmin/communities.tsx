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
};

type Props = {
    communities: Community[];
};

export default function Dashboard({ communities }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Communities List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                                <TableRow>
                                    <TableCell>Community 1</TableCell>
                                    <TableCell>community-1</TableCell>
                                    <TableCell>
                                        <Badge color="destructive">No</Badge>
                                    </TableCell>
                                    <TableCell>10</TableCell>
                                </TableRow>
                            );
                        })}

                        {communities.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    No Community found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
