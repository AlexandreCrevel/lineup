import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className='flex'>
      <h1>Home</h1>
      <UserButton />
    </div>
  );
}
