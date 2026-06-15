export interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

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
