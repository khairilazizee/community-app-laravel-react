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

type Post = {
    id: number;
    title: string;
    content: string;
    type: string;
};

type Props = {
    community: Community;
    posts: Post[];
};

export default function PostsIndex({ community, posts }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Posts', href: '' },
    ];
    const { delete: destroy } = useForm();

    const handleDelete = (postId: number) => {
        destroy(`/communities/${community.id}/posts/${postId}`, {
            onSuccess: () => toast.success('Post deleted.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Posts in {community.name}
                    </h1>
                    <Link href={`/communities/${community.id}/posts/create`}>
                        <Button>Add Post</Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {posts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>
                                    {post.type || 'Post'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {post.content}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={`/communities/${community.id}/posts/${post.id}/edit`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {posts.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                            No posts yet.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
