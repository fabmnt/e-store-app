import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Store } from '../schemas/store-schema';

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
        <CardDescription>{store.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
