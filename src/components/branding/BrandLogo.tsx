import Image from 'next/image'
import { cn } from '@/lib/utils'

type BrandOrientation = 'horizontal' | 'vertical' | 'icon'
type BrandTone = 'auto' | 'light' | 'dark' | 'color'

interface BrandLogoProps {
  orientation?: BrandOrientation
  tone?: BrandTone
  className?: string
  alt?: string
}

const brandAssets: Record<Exclude<BrandOrientation, 'icon'>, Record<Exclude<BrandTone, 'auto'>, string>> = {
  horizontal: {
    color: '/brand/horizontal/color.svg',
    light: '/brand/horizontal/mono-black.svg',
    dark: '/brand/horizontal/mono-white.svg',
  },
  vertical: {
    color: '/brand/vertical/color.svg',
    light: '/brand/vertical/mono-black.svg',
    dark: '/brand/vertical/mono-white.svg',
  },
}

export function BrandLogo({
  orientation = 'horizontal',
  tone = 'auto',
  className,
  alt = 'CriaHub',
}: BrandLogoProps) {
  const dimensions =
    orientation === 'horizontal'
      ? { width: 2453, height: 397 }
      : orientation === 'vertical'
        ? { width: 1891, height: 1001 }
        : { width: 720, height: 720 }

  if (orientation === 'icon') {
    return (
      <Image
        src="/brand/icon.svg"
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        className={className}
      />
    )
  }

  if (tone === 'auto') {
    return (
      <>
        <Image
          src={brandAssets[orientation].color}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className={cn('dark:hidden', className)}
        />
        <Image
          src={brandAssets[orientation].dark}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className={cn('hidden dark:block', className)}
        />
      </>
    )
  }

  return (
    <Image
      src={brandAssets[orientation][tone]}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
    />
  )
}
