import { RedirectType, redirect } from 'next/navigation';

type StorePageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;
  redirect(`/${storeSlug}/my-store`, RedirectType.replace);
}
