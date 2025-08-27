type PageProps = {
  params: Promise<{ productSlug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { productSlug } = await params;

  return <div>{productSlug}</div>;
}
