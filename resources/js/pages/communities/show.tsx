import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Building2,
    Grid2x2,
    LockKeyhole,
    MessageSquare,
    Newspaper,
    PenSquare,
    Search,
    UnlockKeyhole,
} from 'lucide-react';
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

type FeedItem = {
    id: string;
    title: string;
    description: string;
    type: 'Post' | 'News' | 'Business' | 'Service';
    href: string;
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
        'all' | 'posts' | 'news' | 'services' | 'businesses'
    >('all');

    const tabButton = (
        id: 'all' | 'posts' | 'news' | 'services' | 'businesses',
        label: string,
    ) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
                activeTab === id
                    ? 'border-foreground/20 bg-foreground text-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
                    : 'border-border bg-background/70 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
        >
            {label}
        </button>
    );

    const [latestPost] = posts;
    const [latestNews] = news;
    const stats = [
        { label: 'Posts', value: posts.length, icon: PenSquare },
        { label: 'News', value: news.length, icon: Newspaper },
        { label: 'Services', value: services.length, icon: PenSquare },
        { label: 'Businesses', value: businesses.length, icon: Building2 },
    ];
    const joinHref = `/register?community=${community.slug}`;
    const communityInitials = community.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    const feedItems: FeedItem[] = [
        latestPost
            ? {
                  id: `post-${latestPost.id}`,
                  title: latestPost.title,
                  description: latestPost.content,
                  type: 'Post',
                  href: `/communities/${community.slug}/posts/${latestPost.slug ?? latestPost.id}`,
              }
            : null,
        latestNews
            ? {
                  id: `news-${latestNews.id}`,
                  title: latestNews.title,
                  description: latestNews.content,
                  type: 'News',
                  href: `/communities/${community.slug}/news/${latestNews.slug ?? latestNews.id}`,
              }
            : null,
        businesses[0]
            ? {
                  id: `business-${businesses[0].id}`,
                  title: businesses[0].name,
                  description: businesses[0].description ?? 'No description.',
                  type: 'Business',
                  href: `/communities/${community.slug}/businesses/${businesses[0].id}`,
              }
            : null,
        services[0]
            ? {
                  id: `service-${services[0].id}`,
                  title: services[0].name,
                  description: services[0].description ?? 'No description.',
                  type: 'Service',
                  href: `/communities/${community.slug}/services/${services[0].id}`,
              }
            : null,
    ].filter(Boolean) as FeedItem[];
    const tabTypeMap = {
        posts: 'Post',
        news: 'News',
        services: 'Service',
        businesses: 'Business',
    } as const;
    const filteredFeedItems =
        activeTab === 'all'
            ? feedItems
            : feedItems.filter((item) => item.type === tabTypeMap[activeTab]);

    return (
        <>
            <Head title={community.name} />
            <div className="min-h-screen bg-background text-foreground">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 [--sky:oklch(0.96_0.04_210)] [--sun:oklch(0.98_0.04_85)] dark:[--sky:oklch(0.18_0.04_210)] dark:[--sun:oklch(0.22_0.05_85)]">
                        <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[var(--sky)] opacity-70 blur-[120px]" />
                        <div className="absolute -bottom-32 left-12 h-[24rem] w-[24rem] rounded-full bg-[var(--sun)] opacity-70 blur-[110px]" />
                    </div>

                    <div className="relative">
                        <header className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
                                    {communityInitials}
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-foreground">
                                        {community.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Community Hub
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-1 items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search the community..."
                                        className="w-full rounded-full border border-border bg-background/80 px-10 py-2 text-sm text-foreground shadow-sm focus:border-foreground/40 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:text-foreground"
                                >
                                    <Bell className="h-4 w-4" />
                                </button>
                            </div>
                            <nav className="flex items-center gap-3 text-sm">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full border border-border px-4 py-1.5 text-sm transition hover:border-foreground/40"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-full border border-transparent px-4 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={joinHref}
                                            className="rounded-full border border-foreground/20 bg-foreground px-4 py-1.5 text-sm text-background shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                                        >
                                            Request to join
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16">
                            <section className="rounded-3xl border border-border bg-background/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur">
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                                        {community.is_private ? (
                                            <LockKeyhole className="h-3.5 w-3.5" />
                                        ) : (
                                            <UnlockKeyhole className="h-3.5 w-3.5" />
                                        )}
                                        {community.is_private
                                            ? 'Private community'
                                            : 'Public community'}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {community.description ||
                                            'No description.'}
                                    </p>
                                    {is_member && member_role ? (
                                        <Badge className="border border-border bg-background/80 text-muted-foreground">
                                            Member role: {member_role}
                                        </Badge>
                                    ) : null}
                                </div>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {stats.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold text-foreground">
                                                    {item.value}
                                                </div>
                                                <div className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                                    {item.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('all')}
                                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                        activeTab === 'all'
                                            ? 'border-foreground/20 bg-foreground text-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
                                            : 'border-border bg-background/70 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                                    }`}
                                >
                                    <Grid2x2 className="h-4 w-4" />
                                    All
                                </button>
                                {tabButton('news', 'News')}
                                {tabButton('posts', 'Posts')}
                                {tabButton('businesses', 'Businesses')}
                                {tabButton('services', 'Services')}
                            </div>

                            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                                {filteredFeedItems.map((item, index) => (
                                    <Card
                                        key={item.id}
                                        className="overflow-hidden border border-border bg-background/80 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
                                    >
                                        <div className="h-40 w-full bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50" />
                                        <CardHeader>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                                    {item.title.slice(0, 1)}
                                                </div>
                                                <span>Community update</span>
                                                <span className="rounded-full border border-border bg-background/80 px-2 py-0.5 text-xs text-muted-foreground">
                                                    {item.type}
                                                </span>
                                            </div>
                                            <CardTitle className="text-lg">
                                                <Link
                                                    href={item.href}
                                                    className="hover:underline"
                                                >
                                                    {item.title}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    23
                                                </div>
                                                <div>2 hours ago</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {filteredFeedItems.length === 0 && (
                                    <Card className="border border-border bg-background/80 p-6 text-sm text-muted-foreground">
                                        No community activity yet.
                                    </Card>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
