import { getHellfestData } from '@/app/actions/hellfestAPI';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  //   const { data } = lineupData;
  const { data } = await getHellfestData();

  // Extract all stages from the JSON
  const allStageTitles = new Set<string>();
  data.attributes.artist_days.data.forEach((day: any) => {
    day.attributes.artists.data.forEach((artist: any) => {
      const stageTitle = artist.attributes.stage?.data?.attributes?.title;
      if (stageTitle) {
        allStageTitles.add(stageTitle);
      }
    });
  });

  // Create stages first
  const stageTitlesArray = Array.from(allStageTitles);
  await prisma.stage.createMany({
    data: stageTitlesArray.map((title) => ({
      title: title,
      threeLogos: false, // default value if not provided
    })),
    skipDuplicates: true,
  });

  // Fetch stages to map titles to IDs
  const stages = await prisma.stage.findMany();
  const stageMap: Record<string, number> = {};
  stages.forEach((stage) => {
    stageMap[stage.title] = stage.id;
  });

  // Create the lineup and related days/artists
  const lineup = await prisma.lineup.create({
    data: {
      title: data.attributes.title,
      subtitle: data.attributes.subtitle || '',
      locale: data.attributes.locale || 'fr',
      publishedAt: data.attributes.publishedAt
        ? new Date(data.attributes.publishedAt)
        : null,
      days: {
        create: data.attributes.artist_days.data.map((day: any) => ({
          title: day.attributes.title,
          titleSmall: day.attributes.title_small,
          locale: day.attributes.locale || 'fr',
          artists: {
            create: day.attributes.artists.data.map((artist: any) => ({
              title: artist.attributes.title,
              audio_embed: artist.attributes.audio_embed,
              video_embed: artist.attributes.video_embed,
              content: artist.attributes.content || '',
              slug: artist.attributes.slug || '',
              time_start: artist.attributes.time_start
                ? new Date(artist.attributes.time_start)
                : null,
              time_end: artist.attributes.time_end
                ? new Date(artist.attributes.time_end)
                : null,
              order: artist.attributes.order || 0,
              locale: artist.attributes.locale || 'fr',
              country: artist.attributes.country || '',
              socialFacebook: artist.attributes.social_facebook || '',
              socialInstagram: artist.attributes.social_instagram || '',
              // Connect to existing stage
              stage: (() => {
                const stageTitle =
                  artist.attributes.stage?.data?.attributes?.title;
                const stageId =
                  stageTitle && stageMap[stageTitle]
                    ? stageMap[stageTitle]
                    : undefined;
                return stageId
                  ? {
                      connect: { id: stageId },
                    }
                  : undefined;
              })(),
              // Create image if present
              image: artist.attributes.image?.data
                ? {
                    create: {
                      name: artist.attributes.image.data.attributes.name,
                      url: artist.attributes.image.data.attributes.url,
                    },
                  }
                : undefined,
              // Create logo if present
              logo: artist.attributes.logo?.data
                ? {
                    create: {
                      name: artist.attributes.logo.data.attributes.name,
                      url: artist.attributes.logo.data.attributes.url,
                    },
                  }
                : undefined,
              // Handle genres: split style by '/'
              // For each genre, either connect if exists or create a new one
              genres: {
                connectOrCreate: (artist.attributes.style || '')
                  .split('/')
                  .map((g: string) => g.trim())
                  .filter((g: string) => g.length > 0)
                  .map((genreName: string) => ({
                    where: { name: genreName },
                    create: { name: genreName },
                  })),
              },
            })),
          },
        })),
      },
    },
  });

  console.log('Seed completed:', lineup.title);
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
