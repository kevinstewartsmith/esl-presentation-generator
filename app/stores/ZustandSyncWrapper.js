"use client"; // ← This makes it a Client Component

import dynamic from "next/dynamic";
import { useEffect } from "react";

const ZustandSyncClient = dynamic(
  () => import("@app/stores/ZustandSyncClient"),
  { ssr: false }
);

export default function ZustandSyncWrapper() {
  useEffect(() => {
    console.log("🧼 ZustandSyncWrapper mounted");
  }, []);
  return <ZustandSyncClient />;
}
