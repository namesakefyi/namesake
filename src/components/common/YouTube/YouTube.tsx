import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import "./YouTube.css";
import { useEffect, useState } from "react";
import {
  fetchYouTubeVideoDetails,
  type YouTubeOEmbedResponse,
} from "../../../utils/fetchYouTubeVideoDetails";

export interface YouTubeProps {
  url: string;
}

export function YouTube({ url }: YouTubeProps) {
  const [videoData, setVideoData] = useState<YouTubeOEmbedResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchYouTubeVideoDetails(url);
      setVideoData(data);
    };
    fetchData();
  }, [url]);

  if (!videoData) {
    return null;
  }

  const videoId = url.split("v=")[1];
  return <LiteYouTubeEmbed title={videoData.title} id={videoId} />;
}
