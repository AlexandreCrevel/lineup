import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
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
          <SignedIn>{children}</SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
