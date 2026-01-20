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

type Member = {
    id: number;
    role: string;
    status: string;
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

export default function MembersIndex({ community, members }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Members', href: '' },
    ];
    const { delete: destroy, put } = useForm();

    const handleDelete = (memberId: number) => {
        destroy(`/communities/${community.id}/members/${memberId}`, {
            onSuccess: () => toast.success('Member removed.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    const handleStatusChange = (memberId: number, role: string, status: string) => {
        put(`/communities/${community.id}/members/${memberId}`, {
            role,
            status,
            onSuccess: () => toast.success('Member updated.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Members in {community.name}
                    </h1>
                    <Link href={`/communities/${community.id}/members/create`}>
                        <Button>Add Member</Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {members.map((member) => (
                        <Card key={member.id}>
                            <CardHeader>
                                <CardTitle>{member.user.name}</CardTitle>
                                <CardDescription>
                                    {member.user.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {member.role} • {member.status}
                                </p>
                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            href={`/communities/${community.id}/members/${member.id}/edit`}
                                        >
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        {member.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            member.id,
                                                            member.role,
                                                            'active',
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            member.id,
                                                            member.role,
                                                            'inactive',
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                            handleDelete(member.id)
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {members.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                            No members yet.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
