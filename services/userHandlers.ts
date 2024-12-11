import { DeletedObjectJSON, UserJSON } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Handler for the 'user.created' event
 * @param data User data
 */
export const handleUserCreated = async (user: UserJSON) => {
  try {
    if (
      await prisma.user.findUnique({
        where: { clerkId: user.id },
      })
    ) {
      console.log('Utilisateur existant');
      return;
    } else {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.email_addresses?.[0]?.email_address || '',
          name:
            user.first_name || user.last_name
              ? `${user.first_name} ${user.last_name}`
              : null,
        },
      });
    }
    console.log(`Utilisateur créé: ${user.id}`);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
  }
};

/**
 * Handler for the 'user.updated' event
 * @param data User data
 */
export const handleUserUpdated = async (data: UserJSON) => {
  try {
    if (
      await prisma.user.findUnique({
        where: { clerkId: data.id },
      })
    ) {
      await prisma.user.update({
        where: { clerkId: data.id },
        data: {
          email: data.email_addresses?.[0]?.email_address || '',
          name:
            data.first_name || data.last_name
              ? `${data.first_name} ${data.last_name}`
              : null,
        },
      });
    } else {
      console.log('Utilisateur non trouvé');
      return;
    }

    console.log(`Utilisateur mis à jour: ${data.id}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
  }
};

/**
 * Handler for the 'user.deleted' event
 * @param data User data
 */
export const handleUserDeleted = async (user: DeletedObjectJSON) => {
  try {
    if (
      !(await prisma.user.findUnique({
        where: { clerkId: user.id },
      }))
    ) {
      console.log('Utilisateur non trouvé');
      return;
    } else {
      await prisma.user.delete({
        where: { clerkId: user.id },
      });
    }

    console.log(`Utilisateur supprimé: ${user.id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
  }
};
