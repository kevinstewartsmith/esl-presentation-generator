// app/api/unsplash-download/route.js
// Unsplash API guideline: when a photo is actually USED (picked), the app must
// hit that photo's `download_location` endpoint. This is a server-side proxy so
// the key stays on the server. Fire-and-forget from the client.

export const POST = async (req) => {
  try {
    const { downloadLocation } = await req.json();
    if (!downloadLocation) {
      return Response.json({ ok: false }, { status: 400 });
    }
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) return Response.json({ ok: false }, { status: 500 });

    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${key}` },
    });
    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("unsplash-download error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
};
