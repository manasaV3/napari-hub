import { identity } from 'lodash';
import { useMemo } from 'react';

export interface Props {
  className?: string;
  alt?: string;
  src: string;

  /**
   * Function to use for resolving image URLs if special logic is needed to
   * locate the images. This is especially necessary if relative image links.
   */
  imageResolver?(src: string): string;
}

/**
 * Component for rendering an image element. If the image URL is a relative
 * image, then the image is resolved using the GitHub URL.
 */
export function MarkdownImage({
  alt,
  imageResolver = identity,
  src,
  ...props
}: Props) {
  const imageSrc = useMemo(() => imageResolver(src), [imageResolver, src]);

  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} src={imageSrc} {...props} />;
}
