import { AppSidebar } from '@/components/Sidebar/app-sidebar';
import Topbar from '@/components/Topbar/Topbar';
import { SidebarProvider } from '@/components/ui/sidebar';
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
          <SidebarProvider>
            <SignedOut>
              <h2>Disconnected</h2>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <div className='flex flex-col w-full'>
                <AppSidebar />
                <Topbar />
                {children}
              </div>
            </SignedIn>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
