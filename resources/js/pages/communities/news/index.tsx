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

type NewsItem = {
    id: number;
    title: string;
    content: string;
};

type Props = {
    community: Community;
    news: NewsItem[];
};

export default function NewsIndex({ community, news }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Communities', href: '/communities' },
        { title: community.name, href: `/communities/${community.id}/edit` },
        { title: 'News', href: '' },
    ];
    const { delete: destroy } = useForm();

    const handleDelete = (newsId: number) => {
        destroy(`/communities/${community.id}/news/${newsId}`, {
            onSuccess: () => toast.success('News deleted.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="News" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        News in {community.name}
                    </h1>
                    <Link href={`/communities/${community.id}/news/create`}>
                        <Button>Add News</Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {news.map((item) => (
                        <Card key={item.id}>
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>News</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {item.content}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={`/communities/${community.id}/news/${item.id}/edit`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {news.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                            No news yet.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
