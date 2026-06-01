import { COLORS, type NamesakeColor } from "../constants/colors";

type OgImageProps = {
  subhead: string;
  title: string;
  color?: Exclude<NamesakeColor, "black">;
};

export function OgImage({ subhead, title, color = "white" }: OgImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        fontFamily: "Atkinson Hyperlegible Soft",
        backgroundColor: COLORS[color].hex,
        backgroundImage: "url(speckles)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p
          style={{
            fontSize: "32px",
            color: "#111111",
            margin: 0,
          }}
        >
          {subhead}
        </p>
        <p
          style={{
            fontSize: "80px",
            color: "#111111",
            fontWeight: 700,
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
        src="logo"
        height={93}
        width={270}
        style={{
          margin: "-16px -22px",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
