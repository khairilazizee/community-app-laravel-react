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
    slug: string;
    description: string | null;
    is_private: boolean;
};

type Post = {
    id: number;
    title: string;
    content: string;
    type: string;
    slug: string | null;
};

type News = {
    id: number;
    title: string;
    content: string;
    slug: string | null;
};

type Service = {
    id: number;
    name: string;
    description: string | null;
};

type Business = {
    id: number;
    name: string;
    description: string | null;
};

type OwnedItem = {
    id: number;
    name: string;
};

type Props = {
    community: Community;
    posts: Post[];
    news: News[];
    services: Service[];
    businesses: Business[];
    member: {
        role: string;
        status: string;
    };
    owned_businesses: OwnedItem[];
    owned_services: OwnedItem[];
};

export default function CommunityMember({
    community,
    posts,
    news,
    services,
    businesses,
    member,
    owned_businesses,
    owned_services,
}: Props) {
    const [activeTab, setActiveTab] = useState<
        'posts' | 'news' | 'services' | 'businesses'
    >('posts');
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: '' },
    ];

    const tabButton = (
        id: 'posts' | 'news' | 'services' | 'businesses',
        label: string,
    ) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
                activeTab === id
                    ? 'border-foreground/30 bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
        >
            {label}
        </button>
    );

    const [latestPost, ...olderPosts] = posts;
    const [latestNews, ...olderNews] = news;

    const hasOwnedItems =
        owned_businesses.length > 0 || owned_services.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={community.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{community.name}</CardTitle>
                        <CardDescription>
                            {community.description || 'No description.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <div>
                            Status: {member.status} • Role: {member.role}
                        </div>
                        {member.status === 'pending' && (
                            <div>
                                Your request is pending approval by the admin.
                            </div>
                        )}
                        <Link href={`/communities/${community.slug}`}>
                            <Button variant="outline" size="sm">
                                View public page
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {hasOwnedItems && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Listings</CardTitle>
                            <CardDescription>
                                Manage your businesses and services.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                            {owned_businesses.map((business) => (
                                <div
                                    key={`business-${business.id}`}
                                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                >
                                    <span className="font-medium">
                                        {business.name}
                                    </span>
                                    <Link
                                        href={`/communities/${community.id}/businesses/${business.id}/edit`}
                                    >
                                        <Button size="sm" variant="outline">
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                            {owned_services.map((service) => (
                                <div
                                    key={`service-${service.id}`}
                                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                >
                                    <span className="font-medium">
                                        {service.name}
                                    </span>
                                    <Link
                                        href={`/communities/${community.id}/services/${service.id}/edit`}
                                    >
                                        <Button size="sm" variant="outline">
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                            {!hasOwnedItems && (
                                <p className="text-muted-foreground">
                                    No owned listings yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-wrap gap-2">
                    {tabButton('posts', 'Posts')}
                    {tabButton('news', 'News')}
                    {tabButton('services', 'Services')}
                    {tabButton('businesses', 'Businesses')}
                </div>

                {activeTab === 'posts' && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Latest Post</CardTitle>
                                <CardDescription>
                                    Community discussions and announcements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!latestPost ? (
                                    <p className="text-sm text-muted-foreground">
                                        No posts yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href={`/communities/${community.slug}/posts/${latestPost.slug ?? latestPost.id}`}
                                            className="text-xl font-semibold hover:underline"
                                        >
                                            {latestPost.title}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            {latestPost.content}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        {olderPosts.map((post) => (
                            <Card key={post.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        <Link
                                            href={`/communities/${community.slug}/posts/${post.slug ?? post.id}`}
                                            className="hover:underline"
                                        >
                                            {post.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription>Post</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {post.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'news' && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Latest News</CardTitle>
                                <CardDescription>
                                    Updates from the community team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!latestNews ? (
                                    <p className="text-sm text-muted-foreground">
                                        No news yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href={`/communities/${community.slug}/news/${latestNews.slug ?? latestNews.id}`}
                                            className="text-xl font-semibold hover:underline"
                                        >
                                            {latestNews.title}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            {latestNews.content}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        {olderNews.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        <Link
                                            href={`/communities/${community.slug}/news/${item.slug ?? item.id}`}
                                            className="hover:underline"
                                        >
                                            {item.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription>News</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {item.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {services.map((service) => (
                            <Card key={service.id}>
                                <CardHeader>
                                    <CardTitle>{service.name}</CardTitle>
                                    <CardDescription>Service</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {service.description ||
                                            'No description.'}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                        {services.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No services yet.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'businesses' && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {businesses.map((business) => (
                            <Card key={business.id}>
                                <CardHeader>
                                    <CardTitle>{business.name}</CardTitle>
                                    <CardDescription>Business</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {business.description ||
                                            'No description.'}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                        {businesses.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No businesses yet.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
