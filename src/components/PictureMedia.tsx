import { useState, type CSSProperties } from 'react';
import { Camera } from 'lucide-react';
import { IMAGE_MANIFEST } from '../data/imageManifest';

interface PictureMediaProps {
  imageFile: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  preserveNaturalAspect?: boolean;
}

/**
 * Renders untouched palvitphotobooth.com photographs with responsive AVIF/WebP srcset,
 * exact width/height attributes to prevent CLS, and a blurred LQIP backdrop until loaded.
 */
export function PictureMedia({
  imageFile,
  alt,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className = '',
  imgClassName = '',
  style,
  preserveNaturalAspect = false,
}: PictureMediaProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const meta = IMAGE_MANIFEST[imageFile];

  if (!meta || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#1A1917] text-[#F6F1E7]/70 p-6 text-center ${className}`}
      >
        <Camera className="w-6 h-6 mb-2 text-[#C9A25B]" strokeWidth={1.5} />
        <span className="text-xs font-medium">{alt}</span>
      </div>
    );
  }

  const wrapperStyle: CSSProperties = {
    ...(preserveNaturalAspect ? { aspectRatio: `${meta.width} / ${meta.height}` } : {}),
    backgroundImage: `url("${meta.lqip}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    ...style,
  };

  return (
    <div
      style={wrapperStyle}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Subtle blur scrim while decoding image from LQIP */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 backdrop-blur-md transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <picture className="block w-full h-full">
        {meta.avif640 && meta.avif1200 && (
          <source
            type="image/avif"
            srcSet={`${meta.avif640} 640w, ${meta.avif1200} 1200w`}
            sizes={sizes}
          />
        )}
        {meta.webp640 && meta.webp1200 && (
          <source
            type="image/webp"
            srcSet={`${meta.webp640} 640w, ${meta.webp1200} 1200w`}
            sizes={sizes}
          />
        )}
        <img
          src={meta.original}
          alt={alt}
          width={meta.width}
          height={meta.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          className={`block w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      </picture>
    </div>
  );
}
