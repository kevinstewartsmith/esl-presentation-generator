// audioStorage.js
// Shared audio-retrieval capability: get an audio blob by filename, checking
// the local IndexedDB cache first and falling back to the cloud bucket (then
// caching the downloaded blob locally so the next call is a fast local hit).
//
// This is its own single-purpose module — separate from audio SPLITTING and
// from the player COMPONENT — so both AudioSplittingUtil and SnippetPlayer can
// depend on it without depending on each other.

import { getFile, saveFile } from "@app/utils/indexedDBWrapper";

export async function getAudioBlob(fileName) {
  if (!fileName) {
    console.warn("getAudioBlob called with no fileName.");
    return null;
  }

  // 1. Local cache first — IndexedDB.
  try {
    const fileBlob = await getFile(fileName);
    if (fileBlob) {
      console.log(`File ${fileName} retrieved from IndexedDB.`);
      return fileBlob;
    }
  } catch (error) {
    // getFile throws on a missing key — fall through to the bucket.
  }

  // 2. Fall back to the bucket, then cache locally for next time.
  try {
    console.log(`File ${fileName} not in IndexedDB — fetching from bucket.`);
    const response = await fetch(
      `/api/audio?name=${encodeURIComponent(fileName)}`,
    );
    if (!response.ok) {
      throw new Error(`Bucket fetch failed for ${fileName}`);
    }
    const blob = await response.blob();
    await saveFile(fileName, blob);
    console.log(`File ${fileName} downloaded from bucket and cached.`);
    return blob;
  } catch (error) {
    console.error(`File ${fileName} not found in IndexedDB or bucket.`, error);
    return null;
  }
}
