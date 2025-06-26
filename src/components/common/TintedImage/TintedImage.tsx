interface TintedImageProps {
  src: string;
  alt: string;
  className?: string;
}

// https://oliverspies.blog/articles/using-mix-blend-mode-with-partly-transparent-images
export const TintedImage = ({ src, alt, className }: TintedImageProps) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full block select-none mix-blend-luminosity"
      />
    </div>
  );
};
