import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { update } from '@/routes/superadmin/users';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

type Users = {
    name: string;
    email: string;
    password: string;
    id: number;
    is_superadmin: boolean;
};

export default function Index({
    name,
    email,
    password,
    id,
    is_superadmin,
}: Users) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit User',
            href: '/superadmin/users',
        },
        {
            title: name ?? 'User', // how do i get the user name here?
            href: '',
        },
    ];

    const { data, setData, put, errors } = useForm({
        name: name,
        email: email,
        password: password,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(update.url(id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    name="name"
                                    defaultValue={name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    name="email"
                                    defaultValue={email}
                                    disabled
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                {!is_superadmin && (
                                    <Input
                                        name="password"
                                        type="password"
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                )}
                                {is_superadmin && (
                                    <div className="text-sm">
                                        Please change password in{' '}
                                        <a
                                            href="/settings/password"
                                            className="underline"
                                        >
                                            profile
                                        </a>{' '}
                                        settings
                                    </div>
                                )}
                            </div>

                            <div>
                                <Button variant="default" type="submit">
                                    Save
                                </Button>
                                <Button variant="link" type="button">
                                    <Link href="/superadmin/users">Back</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
