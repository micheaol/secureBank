import { Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/redux/ReduxProvider";
import "./globals.css";

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

export const metadata = {
  title: "SecureBank",
  description: "SecureBank - an intentionally vulnerable digital banking ecosystem for AppSec training.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sourceSerif4.variable} ${ibmPlexMono.variable}`}>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
