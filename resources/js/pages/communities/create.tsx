import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/communities';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { LockKeyhole, UnlockKeyhole } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Communities',
        href: '/communities',
    },
    {
        title: 'Create',
        href: '/communities/create',
    },
];

export default function Dashboard() {
    const { data, setData, post, errors } = useForm({
        community_name: '',
        community_description: '',
        community_slug: '',
        banner_image: null as File | null,
        logo_image: null as File | null,
        is_private: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(create.url(), {
            forceFormData: true,
            onSuccess: () => toast.success('Community created successfully.'),
            onError: () => toast.error('Something went wrong.'),
        });
    };

    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/-+/g, '-');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Your Own Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="space-y-3">
                                <Label>Community Name</Label>
                                <Input
                                    name="community_name"
                                    placeholder="Name"
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setData('community_name', name);
                                        setData(
                                            'community_slug',
                                            slugify(name),
                                        );
                                    }}
                                    className={`transition-colors ${errors.community_name ? 'ring-1 ring-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {errors.community_name && (
                                    <div className="text-sm text-red-500">
                                        {errors.community_name}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label>Community Description</Label>
                                <Input
                                    name="community_description"
                                    placeholder="Description"
                                    onChange={(e) =>
                                        setData(
                                            'community_description',
                                            e.target.value,
                                        )
                                    }
                                    className={`transition-colors ${errors.community_description ? 'ring-1 ring-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {errors.community_description && (
                                    <div className="text-sm text-red-500">
                                        {errors.community_description}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label>Slug</Label>
                                <Input
                                    readOnly
                                    name="community_slug"
                                    placeholder="Slug : readonly"
                                    onChange={(e) =>
                                        setData(
                                            'community_slug',
                                            slugify(e.target.value),
                                        )
                                    }
                                    className={`transition-colors ${errors.community_slug ? 'ring-1 ring-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {errors.community_slug && (
                                    <div className="text-sm text-red-500">
                                        {errors.community_slug}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label>Image Banner</Label>
                                <Input
                                    type="file"
                                    name="banner_image"
                                    onChange={(e) =>
                                        setData(
                                            'banner_image',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className={`transition-colors ${errors.banner_image ? 'ring-1 ring-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {errors.banner_image && (
                                    <div className="text-sm text-red-500">
                                        {errors.banner_image}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label>Image Logo</Label>
                                <Input
                                    type="file"
                                    name="logo_image"
                                    onChange={(e) =>
                                        setData(
                                            'logo_image',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className={`transition-colors ${errors.logo_image ? 'ring-1 ring-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {errors.logo_image && (
                                    <div className="text-sm text-red-500">
                                        {errors.logo_image}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Toggle
                                    pressed={data.is_private}
                                    onPressedChange={(value) =>
                                        setData('is_private', value)
                                    }
                                    aria-label="Toggle bookmark"
                                    size="sm"
                                    variant="outline"
                                    className="data-[state=on]:bg-transparent"
                                >
                                    {data.is_private ? (
                                        <LockKeyhole className="h-4 w-4" />
                                    ) : (
                                        <UnlockKeyhole className="h-4 w-4" />
                                    )}
                                    Private
                                </Toggle>
                                {errors.is_private && (
                                    <div className="text-sm text-red-500">
                                        {errors.is_private}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Button variant="default" type="submit">
                                    Save
                                </Button>
                                <Button variant="link" type="button">
                                    <Link href="/communities">Back</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
