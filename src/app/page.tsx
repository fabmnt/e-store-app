import { client } from '@/lib/orpc';

export default async function Home() {
  const salut = await client.hello({ name: 'fabian' });
  const ping = await client.ping();
  return (
    <div>
      {salut} {ping}
    </div>
  );
}
