import { sanityClient } from "sanity:client";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}
