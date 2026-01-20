import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=fraunces:600,700|manrope:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-background text-foreground">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 [--sun:oklch(0.98_0.04_85)] [--sky:oklch(0.96_0.04_210)] dark:[--sun:oklch(0.22_0.05_85)] dark:[--sky:oklch(0.18_0.04_210)]">
                        <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[var(--sky)] blur-[120px] opacity-80" />
                        <div className="absolute -bottom-32 left-12 h-[24rem] w-[24rem] rounded-full bg-[var(--sun)] blur-[110px] opacity-75" />
                        <div className="absolute right-10 top-24 h-20 w-20 rounded-full border border-foreground/10 bg-background/70 shadow-[0_0_0_12px_rgba(255,255,255,0.35)] dark:shadow-[0_0_0_12px_rgba(10,10,10,0.35)]" />
                    </div>

                    <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background">
                                <span className="font-semibold">CA</span>
                            </div>
                            <div className="leading-tight">
                                <div className="font-[Fraunces] text-lg font-semibold">
                                    Community App
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Neighbors supporting neighbors
                                </div>
                            </div>
                        </div>
                        <nav className="flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full border border-border px-4 py-1.5 text-sm transition hover:border-foreground/40"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full border border-transparent px-4 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full border border-foreground/20 bg-foreground px-4 py-1.5 text-sm text-background shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                                        >
                                            Create account
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-10 lg:flex-row lg:items-center lg:gap-16 lg:pb-24">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Family-friendly, trusted, and kind.
                            </div>
                            <h1 className="font-[Fraunces] text-4xl font-semibold leading-tight md:text-5xl">
                                A cozy corner for every community story.
                            </h1>
                            <p className="max-w-xl text-base text-muted-foreground">
                                Share updates, celebrate milestones, and keep
                                neighbors connected. From school news to local
                                services, everything stays close to home.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
                                >
                                    Start a community
                                </Link>
                                <Link
                                    href="/communities"
                                    className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground/80 transition hover:border-foreground/40"
                                >
                                    Browse communities
                                </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
                                <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                                    <div className="font-semibold">News</div>
                                    <div className="text-muted-foreground">
                                        Gentle updates
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                                    <div className="font-semibold">Services</div>
                                    <div className="text-muted-foreground">
                                        Trusted helpers
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                                    <div className="font-semibold">Posts</div>
                                    <div className="text-muted-foreground">
                                        Friendly chat
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="grid gap-4">
                                <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.08)] backdrop-blur">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Community Board
                                            </p>
                                            <p className="text-lg font-semibold">
                                                Maple Grove Families
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                            Active
                                        </span>
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        Weekly meetups, volunteer requests, and
                                        neighborhood celebrations in one place.
                                    </p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-3xl border border-border bg-background/80 p-5">
                                        <p className="text-xs text-muted-foreground">
                                            This week
                                        </p>
                                        <p className="mt-2 text-sm font-semibold">
                                            5 new announcements
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            School fair, safety update, picnic.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-border bg-background/80 p-5">
                                        <p className="text-xs text-muted-foreground">
                                            Local services
                                        </p>
                                        <p className="mt-2 text-sm font-semibold">
                                            9 trusted providers
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Kid-friendly, verified locally.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                <section className="mx-auto w-full max-w-6xl space-y-10 px-6 pb-20">
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                title: 'Invite neighbors',
                                copy: 'Admins can add families, owners, and volunteers in seconds.',
                            },
                            {
                                title: 'Share trusted info',
                                copy: 'Post updates, publish news, and keep everyone in the loop.',
                            },
                            {
                                title: 'Support local',
                                copy: 'Highlight businesses and services with community owners.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-3xl border border-border bg-background/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
                            >
                                <h3 className="font-[Fraunces] text-lg font-semibold">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {item.copy}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[2.5rem] border border-border bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-10 text-center text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:from-emerald-950/40 dark:via-sky-950/40 dark:to-amber-950/30 dark:text-foreground">
                        <h2 className="font-[Fraunces] text-2xl font-semibold md:text-3xl">
                            Make every neighborhood feel like home.
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Start a space for your block, school, or community
                            group today.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:-translate-y-0.5"
                            >
                                Create your community
                            </Link>
                            <Link
                                href="/communities"
                                className="rounded-full border border-border px-6 py-2 text-sm font-medium text-foreground/80 transition hover:border-foreground/40"
                            >
                                Browse public spaces
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
