import { redirect } from 'next/navigation';

type StorePageProps = {
  params: Promise<{
    storeId: string;
  }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { storeId } = await params;
  redirect(`/d/${storeId}/my-store`);
}
