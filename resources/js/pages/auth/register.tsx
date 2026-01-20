import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';
import { useMemo } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const communityParam = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return (
            new URLSearchParams(window.location.search).get('community') ?? ''
        );
    }, []);

    return (
        <AuthLayout
            title={
                communityParam ? 'Join this community' : 'Create your community'
            }
            description={
                communityParam
                    ? 'Enter your details below to join this community'
                    : 'Enter your details below to create your community'
            }
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {communityParam && (
                                <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                                    You are requesting to join community{' '}
                                    <span className="font-medium text-foreground">
                                        {communityParam}
                                    </span>
                                    . An admin will review your request.
                                </div>
                            )}
                            {!communityParam && (
                                <div className="grid gap-2">
                                    <Label htmlFor="community_name">
                                        Community name
                                    </Label>
                                    <Input
                                        id="community_name"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        name="community_name"
                                        placeholder="Your community name"
                                    />
                                    <InputError
                                        message={errors.community_name}
                                        className="mt-2"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        A private community will be created for
                                        you automatically.
                                    </p>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus={!communityParam}
                                    tabIndex={communityParam ? 1 : 2}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={communityParam ? 2 : 3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={communityParam ? 3 : 4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={communityParam ? 4 : 5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={communityParam ? 5 : 6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                            {communityParam && (
                                <input
                                    type="hidden"
                                    name="community"
                                    value={communityParam}
                                />
                            )}
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={communityParam ? 6 : 7}
                            >
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
