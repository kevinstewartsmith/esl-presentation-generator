// gcpAuth.js
// Single place that resolves the GCP service-account credential path and sets
// GOOGLE_APPLICATION_CREDENTIALS so any Google client library (Speech, Storage,
// Gemini/Vertex, future OCR) authenticates automatically.
//
// This is the shared "root" — new GCP routes import ensureGcpCredentials()
// instead of repeating the process.cwd()+".." path logic. Old routes can be
// migrated to it over time.
//
// The service-account key lives in a folder that is a SIBLING of the project
// root (named by SERVICE_ACCOUNT_DIR), so the path is one level above cwd.

import path from "path";

let resolvedPath = null;

export function getServiceAccountPath() {
  if (resolvedPath) return resolvedPath;

  const directory = process.env.SERVICE_ACCOUNT_DIR;
  const serviceFileName = process.env.SERVICE_ACCOUNT_NAME;

  resolvedPath = path.join(process.cwd(), "..", directory, serviceFileName);
  return resolvedPath;
}

// Sets the env var that Google client libraries read for auth. Idempotent.
export function ensureGcpCredentials() {
  const p = getServiceAccountPath();
  process.env.GOOGLE_APPLICATION_CREDENTIALS = p;
  return p;
}
