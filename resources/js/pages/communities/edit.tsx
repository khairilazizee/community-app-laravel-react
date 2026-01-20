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
import { Head, Link, useForm } from '@inertiajs/react';
import { LockKeyhole, UnlockKeyhole } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type Community = {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_private: boolean;
    members: {
        id: number;
        role: string;
        status: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }[];
    businesses: {
        id: number;
        name: string;
        type: string;
        description: string | null;
    }[];
    posts: {
        id: number;
        title: string;
        content: string;
        type: string;
    }[];
    news: {
        id: number;
        title: string;
        content: string;
    }[];
    services: {
        id: number;
        name: string;
        description: string | null;
    }[];
};

type Props = {
    community: Community;
};

const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'businesses', label: 'Businesses' },
    { id: 'posts', label: 'Posts' },
    { id: 'news', label: 'News' },
    { id: 'services', label: 'Services' },
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
        community_name: community.name,
        community_slug: community.slug,
        community_description: community.description,
        is_private: community.is_private,
    });
    const membersForm = useForm({
        email: '',
        user_id: '',
        role: 'member',
    });
    const postsForm = useForm({
        title: '',
        content: '',
        type: 'announcement',
    });
    const newsForm = useForm({
        title: '',
        content: '',
    });
    const servicesForm = useForm({
        name: '',
        description: '',
        owner_id: '',
    });
    const businessesForm = useForm({
        name: '',
        description: '',
        type: 'business',
        owner_id: '',
    });

    const slugified = useMemo(
        () =>
            data.community_name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-'),
        [data.community_name],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(community.id), {
            onSuccess: () => toast.success('Community updated successfully.'),
            onError: () => toast.error('Something went wrong.'),
        }); // replace with your update route if using Wayfinder/Ziggy
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
                                        value={data.community_name}
                                        onChange={(e) =>
                                            setData(
                                                'community_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.community_slug || slugified}
                                        onChange={(e) =>
                                            setData(
                                                'community_slug',
                                                e.target.value,
                                            )
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
                                        value={data.community_description}
                                        onChange={(e) =>
                                            setData(
                                                'community_description',
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
                                <div className="flex justify-between gap-2">
                                    <Button variant="link" type="button">
                                        <Link href="/communities">Back</Link>
                                    </Button>
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
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    membersForm.post(
                                        `/communities/${community.id}/members`,
                                        {
                                            onSuccess: () =>
                                                toast.success(
                                                    'Member added.',
                                                ),
                                            onError: () =>
                                                toast.error(
                                                    'Something went wrong.',
                                                ),
                                        },
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div className="grid gap-2 md:grid-cols-3">
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            value={membersForm.data.email}
                                            onChange={(e) =>
                                                membersForm.setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="user@email.com"
                                        />
                                    </div>
                                    <div>
                                        <Label>User ID</Label>
                                        <Input
                                            value={membersForm.data.user_id}
                                            onChange={(e) =>
                                                membersForm.setData(
                                                    'user_id',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div>
                                        <Label>Role</Label>
                                        <Input
                                            value={membersForm.data.role}
                                            onChange={(e) =>
                                                membersForm.setData(
                                                    'role',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="member"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" size="sm">
                                    Add Member
                                </Button>
                            </form>
                            <div className="mt-4 space-y-2 text-sm">
                                {community.members.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No members yet.
                                    </p>
                                )}
                                {community.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {member.user.name}
                                            </div>
                                            <div className="text-muted-foreground">
                                                {member.user.email}
                                            </div>
                                        </div>
                                        <div className="text-xs uppercase text-muted-foreground">
                                            {member.role} • {member.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    businessesForm.post(
                                        `/communities/${community.id}/businesses`,
                                        {
                                            onSuccess: () =>
                                                toast.success(
                                                    'Business created.',
                                                ),
                                            onError: () =>
                                                toast.error(
                                                    'Something went wrong.',
                                                ),
                                        },
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div className="grid gap-2 md:grid-cols-3">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            value={businessesForm.data.name}
                                            onChange={(e) =>
                                                businessesForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Type</Label>
                                        <Input
                                            value={businessesForm.data.type}
                                            onChange={(e) =>
                                                businessesForm.setData(
                                                    'type',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Owner ID</Label>
                                        <Input
                                            value={
                                                businessesForm.data.owner_id
                                            }
                                            onChange={(e) =>
                                                businessesForm.setData(
                                                    'owner_id',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Input
                                        value={
                                            businessesForm.data.description
                                        }
                                        onChange={(e) =>
                                            businessesForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button type="submit" size="sm">
                                    Add Business
                                </Button>
                            </form>
                            <div className="mt-4 space-y-2 text-sm">
                                {community.businesses.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No businesses yet.
                                    </p>
                                )}
                                {community.businesses.map((business) => (
                                    <div
                                        key={business.id}
                                        className="rounded-md border border-border px-3 py-2"
                                    >
                                        <div className="font-medium">
                                            {business.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {business.description ||
                                                'No description.'}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    postsForm.post(
                                        `/communities/${community.id}/posts`,
                                        {
                                            onSuccess: () =>
                                                toast.success('Post created.'),
                                            onError: () =>
                                                toast.error(
                                                    'Something went wrong.',
                                                ),
                                        },
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div className="grid gap-2 md:grid-cols-2">
                                    <div>
                                        <Label>Title</Label>
                                        <Input
                                            value={postsForm.data.title}
                                            onChange={(e) =>
                                                postsForm.setData(
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Type</Label>
                                        <Input
                                            value={postsForm.data.type}
                                            onChange={(e) =>
                                                postsForm.setData(
                                                    'type',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Content</Label>
                                    <Input
                                        value={postsForm.data.content}
                                        onChange={(e) =>
                                            postsForm.setData(
                                                'content',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button type="submit" size="sm">
                                    Add Post
                                </Button>
                            </form>
                            <div className="mt-4 space-y-2 text-sm">
                                {community.posts.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No posts yet.
                                    </p>
                                )}
                                {community.posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="rounded-md border border-border px-3 py-2"
                                    >
                                        <div className="font-medium">
                                            {post.title}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {post.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'news' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>News</CardTitle>
                            <CardDescription>
                                Create and manage community news.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    newsForm.post(
                                        `/communities/${community.id}/news`,
                                        {
                                            onSuccess: () =>
                                                toast.success('News created.'),
                                            onError: () =>
                                                toast.error(
                                                    'Something went wrong.',
                                                ),
                                        },
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        value={newsForm.data.title}
                                        onChange={(e) =>
                                            newsForm.setData(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Content</Label>
                                    <Input
                                        value={newsForm.data.content}
                                        onChange={(e) =>
                                            newsForm.setData(
                                                'content',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button type="submit" size="sm">
                                    Add News
                                </Button>
                            </form>
                            <div className="mt-4 space-y-2 text-sm">
                                {community.news.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No news yet.
                                    </p>
                                )}
                                {community.news.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-md border border-border px-3 py-2"
                                    >
                                        <div className="font-medium">
                                            {item.title}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {item.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'services' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Services</CardTitle>
                            <CardDescription>
                                Create and manage community services.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    servicesForm.post(
                                        `/communities/${community.id}/services`,
                                        {
                                            onSuccess: () =>
                                                toast.success(
                                                    'Service created.',
                                                ),
                                            onError: () =>
                                                toast.error(
                                                    'Something went wrong.',
                                                ),
                                        },
                                    );
                                }}
                                className="space-y-3"
                            >
                                <div className="grid gap-2 md:grid-cols-2">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            value={servicesForm.data.name}
                                            onChange={(e) =>
                                                servicesForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Owner ID</Label>
                                        <Input
                                            value={servicesForm.data.owner_id}
                                            onChange={(e) =>
                                                servicesForm.setData(
                                                    'owner_id',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Input
                                        value={servicesForm.data.description}
                                        onChange={(e) =>
                                            servicesForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button type="submit" size="sm">
                                    Add Service
                                </Button>
                            </form>
                            <div className="mt-4 space-y-2 text-sm">
                                {community.services.length === 0 && (
                                    <p className="text-muted-foreground">
                                        No services yet.
                                    </p>
                                )}
                                {community.services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="rounded-md border border-border px-3 py-2"
                                    >
                                        <div className="font-medium">
                                            {service.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {service.description ||
                                                'No description.'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
