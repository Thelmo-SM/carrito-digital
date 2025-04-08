'use client';

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
// import { redirect, usePathname } from "next/navigation";
import Style from '@/styles/layout.module.css';
import Nav from "@/components/Header/NavComponent";
import { ProductCartProvider } from "@/store/ProductCartContext";
import { AddressProvider } from "@/store/AddressContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const user = useAuthUsers();
  // const pathName = usePathname();
  
  // const authRoutes = ['/login', '/register', '/forgot-password'];
  // const isInAuthRoute = authRoutes.includes(pathName);
  
  // if(user && isInAuthRoute) {
  //   return redirect('/dashboard');
  // }
  



  return (
    <ProductCartProvider>
    <AddressProvider>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Nav />
        <main className={Style.container}>
        {children}
        </main>
      </body>
    </html>
    </AddressProvider>
    </ProductCartProvider>
  );
}
