import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"Reem Manager Pro",description:"ريم لإدارة الشحن الإلكتروني والاشتراكات"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
