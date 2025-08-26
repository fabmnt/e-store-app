import { safe } from '@orpc/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { client } from '@/lib/orpc';

type StorePageProps = {
  params: Promise<{
    storeId: string;
  }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { storeId } = await params;
  const {
    data: store,
    error,
    isDefined,
  } = await safe(client.stores.protected.getById.call({ id: storeId }));

  if (error) {
    if (isDefined && error.code === 'UNAUTHORIZED') {
      redirect('/auth/signin');
    }

    if (isDefined && error.code === 'NOT_FOUND') {
      notFound();
    }

    throw error;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Your Store</h1>
          <p className="text-muted-foreground text-sm">
            See and update information about your store
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href={`/d/${storeId}/update-store`}>Update Store</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{store.name}</CardTitle>
            <CardDescription>Name of your store</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{store.slug}</CardTitle>
            <CardDescription>Slug of your store</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{store.description ?? 'No description'}</CardTitle>
            <CardDescription>Store description</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>https://milmio.com/{store.slug}</CardTitle>
            <CardDescription>Your store URL</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Address</p>
                <p className="text-sm">{store.address ?? 'No address'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="text-sm">{store.phone ?? 'No phone'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Whatsapp</p>
                <p className="text-sm">{store.whatsapp ?? 'No whatsapp'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="text-sm">{store.email ?? 'No email'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Website</p>
                <p className="text-sm">{store.website ?? 'No website'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Facebook</p>
                <p className="text-sm">{store.facebook ?? 'No facebook'}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Instagram</p>
                <p className="text-sm">{store.instagram ?? 'No instagram'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
