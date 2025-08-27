type PageProps = {
  params: Promise<{ categorySlug?: string[] }>;
};

export default async function PublicStoreCategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;

  return <div>PublicStoreCategoryPage {categorySlug?.join('/')}</div>;
}
