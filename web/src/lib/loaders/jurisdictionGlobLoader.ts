import { glob, type Loader } from "astro/loaders";
import { parseContentPath } from "./parseContentPath";

/**
 * A glob loader that sets each entry's `jurisdiction` from its folder.
 */
export function jurisdictionGlobLoader({
  collection,
  base,
  pattern,
}: {
  collection: string;
  base: string;
  pattern: string;
}): Loader {
  const globLoader = glob({ base, pattern });

  return {
    name: `${collection}-loader`,
    load: (context) =>
      globLoader.load({
        ...context,
        parseData: (props) =>
          context.parseData({
            ...props,
            data: {
              ...props.data,
              jurisdiction: parseContentPath(props.id, collection, props.data),
            },
          }),
      }),
  };
}
