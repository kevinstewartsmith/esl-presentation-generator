// app/api/get-image-unsplash/route.js
// Unsplash photo search. Used by PreReadingVocabSlides AND the Memory & Speculate
// image picker. Returns the raw Unsplash search payload (results[]), so existing
// consumers are unaffected.
//
// SECURITY: the API key comes from env ONLY (process.env.UNSPLASH_ACCESS_KEY) and
// is sent via the Authorization header — never hardcoded, never in the URL/query
// string. (The old version had a hardcoded client_id committed to a public repo;
// that key must be rotated.)

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = (searchParams.get("query") || "").trim();

    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) {
      return Response.json(
        { error: "Unsplash key not configured" },
        { status: 500 },
      );
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      searchQuery,
    )}&per_page=12&content_filter=high`;

    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
    });
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("get-image-unsplash error:", error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};
