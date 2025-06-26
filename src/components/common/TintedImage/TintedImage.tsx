interface TintedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const TintedImage = ({ src, alt, className }: TintedImageProps) => {
  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        className="w-full block select-none mix-blend-luminosity transform-3d-[0,0,0]"
      />
    </div>
  );
};
