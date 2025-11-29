import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/superadmin/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users List',
        href: '/superadmin/users',
    },
];

type Users = {
    name: string;
    email: string;
    id: number;
    is_superadmin: boolean;
};

type Props = {
    users: Users[];
};

export default function Index({ users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Table>
                    {/* <TableCaption>Communities List</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[30%]">Name</TableHead>
                            <TableHead className="min-w-[30%]">Email</TableHead>
                            <TableHead className="w-[4%] text-center">
                                Edit
                            </TableHead>
                            <TableHead className="text-center">
                                Delete
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            return (
                                <TableRow>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="w-[4%] text-center">
                                        <Link href={edit.url(user.id)}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="hover:cursor-pointer"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="w-[4%] text-center">
                                        {user.is_superadmin ? (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="hover:cursor-not-allowed"
                                                disabled
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="hover:cursor-pointer"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6}>No user found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
