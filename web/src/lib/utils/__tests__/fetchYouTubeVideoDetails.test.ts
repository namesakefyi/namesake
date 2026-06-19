import { describe, expect, it, vi } from "vitest";
import { fetchYouTubeVideoDetails } from "../fetchYouTubeVideoDetails";

const MOCK_VIDEO_URL = "https://www.youtube.com/watch?v=abc123";

const mockOEmbedResponse = {
  title: "Test Video",
  author_name: "Test Channel",
  thumbnail_url: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
};

describe("fetchYouTubeVideoDetails", () => {
  it("returns parsed oEmbed data on a successful response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockOEmbedResponse), { status: 200 }),
    );

    const result = await fetchYouTubeVideoDetails(MOCK_VIDEO_URL);

    expect(result).toEqual(mockOEmbedResponse);
  });

  it("calls the oEmbed endpoint with the URL-encoded video URL", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockOEmbedResponse), { status: 200 }),
    );

    await fetchYouTubeVideoDetails(MOCK_VIDEO_URL);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(MOCK_VIDEO_URL)}&format=json`,
    );
  });

  it("returns null when the response is not ok", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(null, { status: 404 }),
    );

    const result = await fetchYouTubeVideoDetails(MOCK_VIDEO_URL);

    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchYouTubeVideoDetails(MOCK_VIDEO_URL);

    expect(result).toBeNull();
  });
});
