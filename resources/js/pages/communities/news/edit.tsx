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

type NewsItem = {
    id: number;
    title: string;
    content: string;
};

type Props = {
    community: Community;
    news: NewsItem;
};

export default function NewsEdit({ community, news }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'News', href: `/communities/${community.id}/news` },
        { title: news.title, href: '' },
    ];
    const { data, setData, put, processing } = useForm({
        title: news.title,
        content: news.content,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/communities/${community.id}/news/${news.id}`, {
            onSuccess: () => toast.success('News updated.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${news.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit News</CardTitle>
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
                                <Label>Content</Label>
                                <Input
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/communities/${community.id}/edit`}>
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
