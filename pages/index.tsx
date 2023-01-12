import Head from 'next/head';

// Componentns
import GamesList from '../components/GamesList';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Game Zone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <GamesList />
      </div>
    </div>
  );
}
