export interface ClerkUser {
  id: string;
  clerkId?: string;
  email_addresses: { email_address: string }[];
  first_name?: string;
  last_name?: string;
}
