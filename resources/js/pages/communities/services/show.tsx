import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

type Community = {
    name: string;
    slug: string;
};

type ServiceOffering = {
    id: number;
    name: string;
    price: number | null;
    duration_minutes: number | null;
    description: string | null;
    category: { name: string } | null;
};

type Service = {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    offerings: ServiceOffering[];
};

type Props = {
    community: Community;
    service: Service;
};

const formatAddress = (service: Service) => {
    const parts = [
        service.address,
        service.city,
        service.state,
        service.zip,
        service.country,
    ].filter(Boolean);
    return parts.join(', ');
};

export default function ServiceShow({ community, service }: Props) {
    const address = formatAddress(service);

    return (
        <>
            <Head title={service.name} />
            <div className="min-h-screen bg-background text-foreground">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
                    <div>
                        <Link
                            href={`/communities/${community.slug}`}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            ← Back to {community.name}
                        </Link>
                        <h1 className="mt-3 text-3xl font-semibold">
                            {service.name}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {service.description || 'No description.'}
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="grid gap-4">
                            {service.offerings.map((offering) => (
                                <Card key={offering.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-base">
                                                {offering.name}
                                            </CardTitle>
                                            {offering.price !== null && (
                                                <span className="text-sm font-semibold">
                                                    ${offering.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        {offering.category?.name && (
                                            <span className="text-xs text-muted-foreground">
                                                {offering.category.name}
                                            </span>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {offering.duration_minutes && (
                                            <div className="text-xs text-muted-foreground">
                                                {offering.duration_minutes} min
                                            </div>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {offering.description ||
                                                'No details.'}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                            {service.offerings.length === 0 && (
                                <Card>
                                    <CardContent className="py-6 text-sm text-muted-foreground">
                                        No offerings listed yet.
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-3 text-sm">
                            <Card className="text-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm">
                                        Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {address || 'Address not provided.'}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
