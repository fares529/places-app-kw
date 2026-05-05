'use client';

import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

interface PlaceGalleryProps {
  images: string[];
  alt: string;
}

export function PlaceGallery({ images, alt }: PlaceGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={clsx(
                'relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 transition-all',
                active === i ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-70 hover:opacity-100'
              )}
              aria-label={`Image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
