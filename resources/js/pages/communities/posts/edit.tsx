import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    approval_status: string;
    tags?: { name: string }[];
};

type Props = {
    community: Community;
    post: Post;
    can_approve: boolean;
};

export default function PostsEdit({ community, post, can_approve }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Posts', href: `/communities/${community.id}/posts` },
        { title: post.title, href: '' },
    ];
    const { data, setData, put, processing } = useForm({
        title: post.title,
        content: post.content,
        type: post.type,
        tags: post.tags?.map((tag) => tag.name).join(', ') ?? '',
        approval_status: post.approval_status ?? 'pending',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/communities/${community.id}/posts/${post.id}`, {
            onSuccess: () => toast.success('Post updated.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${post.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label>Type</Label>
                                <Input
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label>Content</Label>
                                <Input
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label>Tags (comma-separated)</Label>
                                <Input
                                    value={data.tags}
                                    onChange={(e) =>
                                        setData('tags', e.target.value)
                                    }
                                />
                            </div>
                            {can_approve && (
                                <div>
                                    <Label>Approval Status</Label>
                                    <select
                                        className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                                        value={data.approval_status}
                                        onChange={(e) =>
                                            setData(
                                                'approval_status',
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>
                                        <option value="approved">
                                            Approved
                                        </option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Link
                                    href={`/communities/${community.id}/edit`}
                                >
                                    <Button variant="outline" type="button">
                                        Back
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
