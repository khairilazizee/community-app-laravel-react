import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LockKeyhole, UnlockKeyhole } from 'lucide-react';
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

type Props = {
    community: Community;
    posts: Post[];
    news: News[];
    services: Service[];
    businesses: Business[];
    is_member: boolean;
    member_role?: string | null;
};

export default function CommunityShow({
    community,
    posts,
    news,
    services,
    businesses,
    is_member,
    member_role,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const [activeTab, setActiveTab] = useState<
        'posts' | 'news' | 'services' | 'businesses'
    >('posts');

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

    return (
        <>
            <Head title={community.name} />
            <div className="min-h-screen bg-background">
                <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
                    <Link href="/" className="text-lg font-semibold">
                        Communities
                    </Link>
                    <nav className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-md border border-border px-3 py-1.5 hover:border-foreground/30"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-md border border-transparent px-3 py-1.5 hover:border-foreground/20"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={`/register?community=${community.slug}`}
                                    className="inline-flex items-center rounded-full border border-foreground/20 bg-foreground px-4 py-1.5 text-sm text-background transition hover:-translate-y-0.5"
                                >
                                    Request to join
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {community.name}
                                {community.is_private ? (
                                    <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <UnlockKeyhole className="h-4 w-4 text-muted-foreground" />
                                )}
                            </CardTitle>
                            <CardDescription>
                                {community.description || 'No description.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                {community.is_private
                                    ? 'Private community'
                                    : 'Public community'}
                                {is_member && member_role
                                    ? ` • Member role: ${member_role}`
                                    : null}
                            </div>
                            {auth.user && is_member && (
                                <div className="mt-3">
                                    <Link
                                        href={`/communities/${community.slug}/member`}
                                        className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition hover:border-foreground/40"
                                    >
                                        Member view
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

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
                                        <CardDescription>
                                            Service
                                        </CardDescription>
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
                                        <CardDescription>
                                            Business
                                        </CardDescription>
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
                </main>
            </div>
        </>
    );
}
