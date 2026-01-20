import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LockKeyhole, UnlockKeyhole } from 'lucide-react';

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
};

type News = {
    id: number;
    title: string;
    content: string;
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

    return (
        <>
            <Head title={community.name} />
            <div className="min-h-screen bg-slate-50">
                <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
                    <Link href="/" className="text-lg font-semibold">
                        Communities
                    </Link>
                    <nav className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-md border border-slate-200 px-3 py-1.5 hover:border-slate-300"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-md border border-transparent px-3 py-1.5 hover:border-slate-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-md border border-slate-200 px-3 py-1.5 hover:border-slate-300"
                                >
                                    Register
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
                                    <LockKeyhole className="h-4 w-4 text-slate-500" />
                                ) : (
                                    <UnlockKeyhole className="h-4 w-4 text-slate-500" />
                                )}
                            </CardTitle>
                            <CardDescription>
                                {community.description || 'No description.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-slate-600">
                                {community.is_private
                                    ? 'Private community'
                                    : 'Public community'}
                                {is_member && member_role
                                    ? ` • Member role: ${member_role}`
                                    : null}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Posts</CardTitle>
                                <CardDescription>
                                    Community discussions and announcements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {posts.length === 0 && (
                                    <p className="text-slate-500">
                                        No posts yet.
                                    </p>
                                )}
                                {posts.map((post) => (
                                    <div key={post.id} className="space-y-1">
                                        <div className="font-medium">
                                            {post.title}
                                        </div>
                                        <p className="text-slate-600">
                                            {post.content}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>News</CardTitle>
                                <CardDescription>
                                    Updates from the community team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {news.length === 0 && (
                                    <p className="text-slate-500">
                                        No news yet.
                                    </p>
                                )}
                                {news.map((item) => (
                                    <div key={item.id} className="space-y-1">
                                        <div className="font-medium">
                                            {item.title}
                                        </div>
                                        <p className="text-slate-600">
                                            {item.content}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Services</CardTitle>
                                <CardDescription>
                                    Member-owned services in this community.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {services.length === 0 && (
                                    <p className="text-slate-500">
                                        No services yet.
                                    </p>
                                )}
                                {services.map((service) => (
                                    <div key={service.id} className="space-y-1">
                                        <div className="font-medium">
                                            {service.name}
                                        </div>
                                        <p className="text-slate-600">
                                            {service.description ||
                                                'No description.'}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Businesses</CardTitle>
                                <CardDescription>
                                    Local businesses and shops.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {businesses.length === 0 && (
                                    <p className="text-slate-500">
                                        No businesses yet.
                                    </p>
                                )}
                                {businesses.map((business) => (
                                    <div
                                        key={business.id}
                                        className="space-y-1"
                                    >
                                        <div className="font-medium">
                                            {business.name}
                                        </div>
                                        <p className="text-slate-600">
                                            {business.description ||
                                                'No description.'}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
