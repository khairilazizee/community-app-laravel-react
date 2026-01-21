import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

type Community = {
    name: string;
    slug: string;
};

type BusinessItem = {
    id: number;
    name: string;
    price: number | null;
    description: string | null;
    category: { name: string } | null;
};

type BusinessHour = {
    day_of_week: number;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
};

type Business = {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    items: BusinessItem[];
    hours: BusinessHour[];
};

type Props = {
    community: Community;
    business: Business;
};

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatAddress = (business: Business) => {
    const parts = [
        business.address,
        business.city,
        business.state,
        business.zip,
        business.country,
    ].filter(Boolean);
    return parts.join(', ');
};

export default function BusinessShow({ community, business }: Props) {
    const address = formatAddress(business);
    const sortedHours = [...business.hours].sort(
        (a, b) => a.day_of_week - b.day_of_week,
    );

    return (
        <>
            <Head title={business.name} />
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
                            {business.name}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {business.description || 'No description.'}
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="grid gap-4">
                            {business.items.map((item) => (
                                <Card key={item.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-base">
                                                {item.name}
                                            </CardTitle>
                                            {item.price !== null && (
                                                <span className="text-sm font-semibold">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        {item.category?.name && (
                                            <span className="text-xs text-muted-foreground">
                                                {item.category.name}
                                            </span>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description || 'No details.'}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                            {business.items.length === 0 && (
                                <Card>
                                    <CardContent className="py-6 text-sm text-muted-foreground">
                                        No items listed yet.
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-3 text-sm">
                            <Card className="text-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm">
                                        Business Hours
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    {sortedHours.length === 0 && (
                                        <div className="text-muted-foreground">
                                            Hours not set.
                                        </div>
                                    )}
                                    {sortedHours.map((hour) => (
                                        <div
                                            key={hour.day_of_week}
                                            className="flex justify-between"
                                        >
                                            <span className="text-muted-foreground">
                                                {dayLabels[hour.day_of_week] ??
                                                    'Day'}
                                            </span>
                                            <span>
                                                {hour.is_closed
                                                    ? 'Closed'
                                                    : `${hour.open_time ?? '--:--'} - ${hour.close_time ?? '--:--'}`}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

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
