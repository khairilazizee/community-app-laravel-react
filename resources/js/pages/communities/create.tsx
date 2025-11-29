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
import { useState } from 'react';

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
    const [isPrivate, setIsPrivate] = useState(false);

    const { data, setData, post, errors } = useForm({
        community_name: '',
        community_description: '',
        community_slug: '',
        banner_image: '',
        logo_image: '',
        is_private: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(create.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div>
                                <Label>Community Name</Label>
                                <Input
                                    name="community_name"
                                    placeholder="Name"
                                    onChange={(e) =>
                                        setData(
                                            'community_name',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
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
                                />
                            </div>
                            <div>
                                <Label>Slug</Label>
                                <Input
                                    name="community_slug"
                                    placeholder="Slug"
                                    onChange={(e) =>
                                        setData(
                                            'community_slug',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label>Image Banner</Label>
                                <Input type="file" name="banner_image" />
                            </div>
                            <div>
                                <Label>Image Logo</Label>
                                <Input type="file" name="logo_image" />
                            </div>
                            <div>
                                <Toggle
                                    pressed={isPrivate}
                                    onPressedChange={(value) =>
                                        setIsPrivate(value)
                                    }
                                    aria-label="Toggle bookmark"
                                    size="sm"
                                    variant="outline"
                                    className="data-[state=on]:bg-transparent"
                                >
                                    {isPrivate ? (
                                        <LockKeyhole className="h-4 w-4" />
                                    ) : (
                                        <UnlockKeyhole className="h-4 w-4" />
                                    )}
                                    Private
                                </Toggle>
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
