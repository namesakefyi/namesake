type Color = {
  id: string;
  name: string;
  hex: string;
  forText?: boolean;
};

export const COLOR_KEYS = [
  "purple",
  "pink",
  "blue",
  "yellow",
  "green",
  "brown",
  "black",
  "white",
] as const;

export type NamesakeColor = (typeof COLOR_KEYS)[number];

export const COLORS: Record<NamesakeColor, Color> = {
  purple: {
    id: "purple",
    name: "Namesake Purple",
    hex: "#CDA5EF",
  },
  pink: {
    id: "pink",
    name: "Pastel Pink",
    hex: "#ECADD4",
  },
  blue: {
    id: "blue",
    name: "Pastel Blue",
    hex: "#96C7F2",
  },
  yellow: {
    id: "yellow",
    name: "Pastel Yellow",
    hex: "#ECDD85",
  },
  green: {
    id: "green",
    name: "Pastel Green",
    hex: "#97CF9C",
  },
  brown: {
    id: "brown",
    name: "Pastel Brown",
    hex: "#DDB896",
  },
  black: {
    id: "black",
    name: "Photocopy Black",
    hex: "#111111",
    forText: true,
  },
  white: {
    id: "white",
    name: "Photocopy White",
    hex: "#E1E1E1",
    forText: true,
  },
};
