import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Artist } from '@/types/artists';
import Image from 'next/image';

const ArtistCard = ({ artist }: { artist: Artist }) => {
  return (
    <Card className='flex flex-row p-3 gap-3 m-3'>
      <div className='relative w-[50px] h-[50px] rounded-full overflow-hidden'>
        <Image
          src={artist.photo || ''}
          alt={artist.name}
          fill
          className='object-cover object-center'
          sizes='50px'
        />
      </div>
      <div className='flex flex-col'>
        <CardTitle>{artist.name}</CardTitle>
        <p className='text-sm'>{artist.scene}</p>
        <CardDescription>{artist.day}</CardDescription>
      </div>
    </Card>
  );
};

export default ArtistCard;
