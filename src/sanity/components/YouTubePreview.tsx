import { Text } from "@sanity/ui";
import { YouTube } from "../../components/common/YouTube";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import type { PreviewProps } from "sanity";

export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props;

  return typeof url === "string" ? (
    <YouTube url={url} />
  ) : (
    <Text>Add a YouTube URL</Text>
  );
}
