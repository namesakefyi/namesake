interface TintedImageProps {
  src: string;
  alt: string;
  className?: string;
}

// https://oliverspies.blog/articles/using-mix-blend-mode-with-partly-transparent-images
export const TintedImage = ({ src, alt, className }: TintedImageProps) => {
  return (
    <div className={`relative dark:bg-theme-12 rounded-2xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full select-none mix-blend-screen dark:mix-blend-multiply"
      />
      <img
        aria-hidden
        src={src}
        alt={alt}
        className="absolute inset-0 -z-1 [filter:_drop-shadow(0px_10000px_0_var(--color-theme-12))] translate-y-[-10000px]"
      />
    </div>
  );
};
