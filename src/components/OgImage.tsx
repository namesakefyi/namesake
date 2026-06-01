import { COLORS, type NamesakeColor } from "../constants/colors";

type OgImageProps = {
  subhead: string;
  title: string;
  color?: Exclude<NamesakeColor, "black">;
  origin: string;
};

export function OgImage({ subhead, title, color = "white", origin }: OgImageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px",
        fontFamily: "Atkinson Hyperlegible",
        backgroundColor: COLORS[color].hex,
        backgroundImage: `url(${origin}/site/speckles-black.svg)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p style={{ display: "flex", fontSize: "32px", color: "#111111", margin: 0 }}>
          {subhead}
        </p>
        <p
          style={{
            display: "flex",
            fontSize: "80px",
            fontWeight: 700,
            color: "#111111",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            maxWidth: "960px",
          }}
        >
          {title}
        </p>
      </div>
      <img
        alt=""
        src={`${origin}/site/brand-assets/namesake-wordmark.svg`}
        height={93}
        width={270}
        style={{ margin: "-16px -22px", objectFit: "contain" }}
      />
    </div>
  );
}
