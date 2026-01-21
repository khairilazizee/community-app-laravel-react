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

type Props = {
    community: Community;
};

export default function PostsCreate({ community }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'Posts', href: `/communities/${community.id}/posts` },
        { title: 'Add', href: '' },
    ];
    const { data, setData, post, processing } = useForm({
        title: '',
        content: '',
        type: 'announcement',
        tags: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/communities/${community.id}/posts`, {
            onSuccess: () => toast.success('Post created.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Post" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Post</CardTitle>
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
                            <p className="text-sm text-muted-foreground">
                                Posts need admin approval before they appear
                                publicly.
                            </p>
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
