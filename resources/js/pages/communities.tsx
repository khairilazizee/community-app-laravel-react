import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { create, deleteMethod } from '@/routes/communities';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LockKeyhole, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Communities',
        href: '/communities',
    },
];

type CommunitiesModel = {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_private: boolean;
    url: string;
};

type Props = {
    my_communities: CommunitiesModel[];
    all_communities: CommunitiesModel[];
};

export default function Dashboard({ my_communities, all_communities }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (community: any) => {
        destroy(deleteMethod.url(community.id), {
            onSuccess: () => toast.success('Community deleted successfully.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

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
                <div>
                    <h2 className="text-xl font-medium">My Communities</h2>
                    <div className="mt-5 grid grid-cols-3 gap-4">
                        {my_communities.map((community) => {
                            return (
                                <div key={community.id} className="grid">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between">
                                                {community.name}
                                                {community.is_private ? (
                                                    <LockKeyhole className="h-4 w-4" />
                                                ) : null}
                                            </CardTitle>
                                            <CardDescription>
                                                {community.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/communities/${community.id}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/communities/${community.slug}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(community)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                        {my_communities.length === 0 && (
                            <div className="text-left text-sm text-muted-foreground">
                                No Communities found. Create one to start.
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-medium">All Communities</h2>
                    <div className="mt-5 grid grid-cols-3 gap-4">
                        {all_communities.map((community) => {
                            return (
                                <div key={community.id} className="grid">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                {community.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {community.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/communities/${community.slug}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                        {all_communities.length === 0 && (
                            <div className="text-left text-sm text-muted-foreground">
                                No Communities found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
