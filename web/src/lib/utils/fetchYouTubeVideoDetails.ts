export interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

/**
 * Given a YouTube video URL, return its title, author, and thumbnail via
 * the oEmbed API, or null if the request fails.
 *
 * @example
 * await fetchYouTubeVideoDetails("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
 * // { title: "...", author_name: "...", thumbnail_url: "..." }
 */
export async function fetchYouTubeVideoDetails(
  url: string,
): Promise<YouTubeOEmbedResponse | null> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodedUrl}&format=json`,
    );

    if (!response.ok) {
      return null;
    }

    const data: YouTubeOEmbedResponse = await response.json();

    return data;
  } catch {
    return null;
  }
}
