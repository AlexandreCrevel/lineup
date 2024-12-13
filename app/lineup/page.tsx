import ArtistCard from '@/components/ArtistCard/ArtistCard';
import type { Artist } from '@/types/artists';
import { getArtistData } from '../actions/getArtistData';

const Lineup = async () => {
  const data = await getArtistData();
  console.log(data);
  return (
    <div>
      Lineup
      {data.map((artist: Artist) => {
        return <ArtistCard key={artist.id} artist={artist} />;
      })}
    </div>
  );
};
export default Lineup;
