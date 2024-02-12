"use client";

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import { Providers } from "./provider";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
} from "@nextui-org/react";
import "./globals.css";


export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <Navbar isBordered>
            <NavbarContent justify="start">
              <NavbarContent className="hidden sm:flex gap-3">
                <NavbarItem
                  isActive={usePathname() === "/download" ? true : false}
                >
                  <Link
                    href="/download"
                    color={
                      usePathname() === "/download" ? "secondary" : "primary"
                    }
                  >
                    Download
                  </Link>
                </NavbarItem>
                <NavbarItem
                  isActive={usePathname() === "/upload" ? true : false}
                >
                  <Link
                    href="/upload"
                    color={
                      usePathname() === "/upload" ? "secondary" : "primary"
                    }
                  >
                    Upload
                  </Link>
                </NavbarItem>
              </NavbarContent>
            </NavbarContent>
            <NavbarContent as="div" className="items-center" justify="end">
              <Input
                classNames={{
                  base: "max-w-full sm:max-w-[10rem] h-10",
                  mainWrapper: "h-full",
                  input: "text-small",
                  inputWrapper:
                    "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                }}
                placeholder="Type to search..."
                size="sm"
                type="search"
              />
            </NavbarContent>
          </Navbar>
          {children}
        </Providers>
      </body>
    </html>
  );
}
