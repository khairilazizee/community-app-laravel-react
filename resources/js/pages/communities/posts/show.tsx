import { Button } from '@/components/ui/button';
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

type Community = {
    id: number;
    name: string;
    slug: string;
    is_private: boolean;
};

type Post = {
    id: number;
    title: string;
    content: string;
    type: string;
    approval_status: string;
    tags?: { name: string }[];
};

type Props = {
    community: Community;
    post: Post;
};

export default function PostShow({ community, post }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title={post.title} />
            <div className="min-h-screen bg-background text-foreground">
                <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-6">
                    <Link href="/" className="text-lg font-semibold">
                        Community App
                    </Link>
                    <nav className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full border border-border px-4 py-1.5 transition hover:border-foreground/40"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-full border border-transparent px-4 py-1.5 text-muted-foreground transition hover:text-foreground"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-full border border-foreground/20 bg-foreground px-4 py-1.5 text-background transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pb-16">
                    <Link
                        href={`/communities/${community.slug}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Back to {community.name}
                    </Link>
                    <Card>
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>{post.type}</CardDescription>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag.name}
                                            className="rounded-full border border-border px-2 py-0.5"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {post.approval_status !== 'approved' && (
                                <div className="text-xs text-muted-foreground">
                                    This post is awaiting admin approval.
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                {post.content}
                            </p>
                            <Link href={`/communities/${community.slug}`}>
                                <Button variant="outline" size="sm">
                                    View community
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </>
    );
}
