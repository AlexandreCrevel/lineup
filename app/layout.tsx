import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserProfile,
} from '@clerk/nextjs';
import './globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body>
          <SignedOut>
            <h2>Disconnected</h2>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserProfile />
            <h2>Connected</h2>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
