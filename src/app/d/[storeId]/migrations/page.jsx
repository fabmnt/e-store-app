'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createProductAction } from '@/rpc/products/products-actions';
import { createProductImageAction } from '@/rpc/products-images/products-images-actions';

export default function MigrationsPage() {
  const { storeId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = JSON.parse(e.target.data.value);
    let i = 1;
    const dataParsed = data.map((item) => ({
      name: item.name,
      // biome-ignore lint/style/useTemplate: <fdsexplanation>
      slug: item.name.toLowerCase().replace(/ /g, '-') + '-' + i++,
      storeId,
      price: 0,
      stock: 0,
      imgUrl: item.imageUrl,
      categoryId: '3c38145c-0a35-42a5-a67d-00778a93c482',
      tags: [],
      description: '',
    }));

    for (const item of dataParsed) {
      const createdProduct = await createProductAction(item);
      console.log(createdProduct);
      const createdProductImage = await createProductImageAction({
        url: item.imgUrl,
        productId: createdProduct[1].id,
        storeId,
        fileKey: null,
      });
      console.log(createdProductImage);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <textarea name="data" />
      <Button type="submit">Migrate</Button>
    </form>
  );
}
