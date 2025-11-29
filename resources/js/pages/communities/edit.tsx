import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import { update } from '@/routes/communities';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LockKeyhole, UnlockKeyhole } from 'lucide-react';
import { useMemo, useState } from 'react';

type Community = {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_private: boolean;
};

type Props = {
    community: Community;
};

const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'businesses', label: 'Businesses' },
    { id: 'posts', label: 'Posts' },
    { id: 'members', label: 'Members' },
];

export default function EditCommunity({ community }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: 'Edit Community', href: '/communities' },
        { title: community.name, href: '' },
    ];
    const [activeTab, setActiveTab] = useState<string>('info');

    const { data, setData, put, processing } = useForm({
        name: community.name,
        slug: community.slug,
        description: community.description,
        is_private: community.is_private,
    });

    const slugified = useMemo(
        () =>
            data.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-'),
        [data.name],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(community.id)); // replace with your update route if using Wayfinder/Ziggy
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${community.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {community.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.id}
                                variant={
                                    activeTab === tab.id ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {activeTab === 'info' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Info</CardTitle>
                            <CardDescription>
                                Update name, slug and description.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug || slugified}
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Auto-generated from name: {slugified}
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Toggle
                                        pressed={data.is_private}
                                        onPressedChange={(value) =>
                                            setData('is_private', value)
                                        }
                                        aria-label="Toggle bookmark"
                                        size="sm"
                                        variant="outline"
                                        className="data-[state=on]:bg-transparent"
                                    >
                                        {data.is_private ? (
                                            <LockKeyhole className="h-4 w-4" />
                                        ) : (
                                            <UnlockKeyhole className="h-4 w-4" />
                                        )}
                                        Private
                                    </Toggle>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="submit"
                                        variant="default"
                                        disabled={processing}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'members' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                            <CardDescription>
                                Manage community members and roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                TODO: list members, invite, change roles.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'businesses' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Businesses</CardTitle>
                            <CardDescription>
                                Link businesses to this community.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                TODO: list/add businesses.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'posts' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Posts</CardTitle>
                            <CardDescription>
                                Create and manage community posts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                TODO: list/create posts.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
