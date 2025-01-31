import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "./_components/ui/toaster";
import Footer from "./_components/Footer";
import Container from "./_components/ui/Container";
import { Separator } from "./_components/ui/separator";
import { Navbar } from "./_components/Navbar";
import { ThemeProvider } from "./_components/theme-provider";
import { TooltipProvider } from "./_components/ui/tooltip";

export const metadata: Metadata = {
  title: "Mi bebe",
  description: "An app for tracking your baby's events",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <TRPCReactProvider>
        <TooltipProvider>
          <html>
            <head></head>
            <body>
              <div className="grid h-dvh w-full grid-rows-[auto_auto_1fr_auto]">
                <Navbar />
                <Separator />
                <Container>{children}</Container>
                <Footer />
              </div>
              <Toaster />
            </body>
          </html>
        </TooltipProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
