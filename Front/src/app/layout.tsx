import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import Providers  from "../../components/layout/provider";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
} from "@nextui-org/react";
import "./globals.css";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

// eslint-disable-next-line @next/next/no-async-client-component
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
    
      <body className={`${inter.className} overflow-hidden`}> 
       <Providers session={session}>
          {children}  
            </Providers>  
      </body> 
      
    </html>
  );
}