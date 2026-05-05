'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

type Props = Omit<ImageProps, 'onLoad'> & {
  skeletonClassName?: string
}

export default function ImageWithSkeleton({ skeletonClassName = '', alt, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden ${skeletonClassName}`}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>
      )}
      <Image
        alt={alt}
        {...rest}
        onLoad={() => setLoaded(true)}
        className={`${rest.className ?? ''} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </>
  )
}
