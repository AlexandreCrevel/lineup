'use server';
import { PrismaClient } from '@prisma/client';

export const getArtistData = async () => {
  const prisma = new PrismaClient();
  const artists = await prisma.artist.findMany({
    select: {
      id: true,
      title: true,
      image: {
        select: {
          url: true,
        },
      },
      time_start: true,
      day: {
        select: {
          title: true,
        },
      },
      stage: {
        select: {
          title: true,
        },
      },
    },
  });

  return artists.map((artist) => ({
    id: artist.id,
    name: artist.title,
    photo: artist.image?.url || null,
    day: artist.day?.title || null,
    scene: artist.stage?.title || null,
  }));
};
