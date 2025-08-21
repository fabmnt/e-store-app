import { client } from '@/lib/orpc';

export default async function Home() {
  const salut = await client.hello({ name: 'fabian' });
  const ping = await client.pong();
  return (
    <div>
      {salut} {ping}
    </div>
  );
}
