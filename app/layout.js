import { Inter } from "next/font/google";
import "@styles/globals.css";
import { AudioTextProvider } from "./contexts/AudioTextContext";
import { PresentationContextProvider } from "./contexts/PresentationContext";
import { GlobalVariablesContextProvider } from "./contexts/GlobalVariablesContext";
import { ReadingForGistAndDetailContextProvider } from "./contexts/ReadingForGistAndDetailContext";
import { ThinkPairShareProvider } from "./contexts/ThinkPairShareContext";
import Nav from "./components/Nav";
import { DashboardContextProvider } from "./contexts/DashboardContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ESL Presentation Generator",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThinkPairShareProvider>
        <ReadingForGistAndDetailContextProvider>
          {/* <DashboardContextProvider> */}
          <AudioTextProvider>
            {/* <PresentationContextProvider> */}
            <GlobalVariablesContextProvider>
              <body className={inter.className}>
                <Nav>{children}</Nav>
              </body>
            </GlobalVariablesContextProvider>
            {/* </PresentationContextProvider> */}
          </AudioTextProvider>
          {/* </DashboardContextProvider> */}
        </ReadingForGistAndDetailContextProvider>
      </ThinkPairShareProvider>
    </html>
  );
}
