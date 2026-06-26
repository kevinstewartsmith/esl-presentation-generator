import { Inter } from "next/font/google";
import "@styles/globals.css";
import { GlobalVariablesContextProvider } from "./contexts/GlobalVariablesContext";
import Nav from "./components/Nav";
import ZustandSyncWrapper from "@app/stores/ZustandSyncWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ESL Presentation Generator",
  description: "Plan engaging lessons FAST",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ZustandSyncWrapper />

        <GlobalVariablesContextProvider>
          <Nav>{children}</Nav>
        </GlobalVariablesContextProvider>
      </body>
    </html>
  );
}
