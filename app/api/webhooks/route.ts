import {
  handleUserCreated,
  handleUserDeleted,
  handleUserUpdated,
} from '@/services/userHandlers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  try {
    const { type, data } = evt;
    console.log(type, data);
    switch (type) {
      case 'user.created':
        console.log(`Utilisateur a créer: ${data.id}`);
        await handleUserCreated(data);
        break;
      case 'user.updated':
        console.log(`Utilisateur a uploader: ${data.id}`);
        await handleUserUpdated(data);
        break;
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Événement non géré: ${type}`);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Erreur lors du traitement du webhook', error);
    return new Response('Error: Could not process webhook', {
      status: 500,
    });
  }
}
