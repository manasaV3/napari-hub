import clsx from 'clsx';
import schema from 'hast-util-sanitize/lib/github.json';
import { useMemo } from 'react';
import ReactMarkdown, { PluggableList, TransformOptions } from 'react-markdown';
import raw from 'rehype-raw';
import sanitize from 'rehype-sanitize';
import slug from 'rehype-slug';
import externalLinks from 'remark-external-links';
import gfm from 'remark-gfm';
import removeComments from 'remark-remove-comments';

import styles from './Markdown.module.scss';
import { MarkdownCode } from './MarkdownCode';
import { MarkdownImage, Props as MarkdownImageProps } from './MarkdownImage';
import { MarkdownParagraph } from './MarkdownParagraph';
import { MarkdownTOC } from './MarkdownTOC';

interface Props {
  // Optional CSS class for markdown component.
  className?: string;

  // Markdown code.
  children: string;

  // Disable H1 headers when rendering markdown.
  disableHeader?: boolean;

  // Render markdown with placeholder styles.
  placeholder?: boolean;

  /**
   * Function to use for resolving image URLs if special logic is needed to
   * locate the images. This is especially necessary if relative image links.
   */
  imageResolver?(src: string): string;
}

const REMARK_PLUGINS: PluggableList = [
  // Add support for GitHub style markdown like checkboxes.
  gfm,

  // Remove HTML comments from markdown.
  removeComments,

  [externalLinks, { target: '_blank', rel: 'noreferrer' }],
];

const REHYPE_PLUGINS: PluggableList = [
  // Parse inner HTML
  raw,

  // Sanitize inner HTML
  [
    sanitize,
    {
      ...schema,
      attributes: {
        ...schema.attributes,
        // Enable class names for code blocks
        code: ['className'],
      },
    },
  ],

  // Add slug IDs to every heading.
  slug,
];

/**
 * Component for rendering Markdown consistently in napari hub.
 */
export function Markdown({
  className,
  children,
  disableHeader,
  placeholder,
  imageResolver,
}: Props) {
  const components = useMemo(() => {
    const result: TransformOptions['components'] = {
      code: MarkdownCode,
      p: MarkdownParagraph,
      img: (props) => (
        <MarkdownImage
          // The `props` type is incorrect for image nodes for some reason, so
          // it needs to be casted to unknown first.
          {...(props as unknown as MarkdownImageProps)}
          imageResolver={imageResolver}
        />
      ),
    };

    if (disableHeader) {
      result.h1 = () => null;
    }

    return result;
  }, [disableHeader, imageResolver]);

  return (
    <ReactMarkdown
      className={clsx(
        className,
        styles.markdown,
        placeholder && styles.placeholder,
      )}
      components={components}
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
    >
      {children}
    </ReactMarkdown>
  );
}

Markdown.TOC = MarkdownTOC;
