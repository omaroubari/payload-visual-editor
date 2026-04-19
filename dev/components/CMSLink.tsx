import type { Page, Post } from '@/payload-types';
import type { ButtonProps } from 'dev/components/ui/button';

import { Button } from 'dev/components/ui/button'
import { cn } from 'dev/lib/utils'
import Link from 'next/link'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: null | string
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: number | Page | Post | string
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: null | string
}

export const CMSLink = (props: CMSLinkType) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) {return null}

  const size = appearance === 'link' ? 'default' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  ///

  const variant = appearance === 'outline' ? 'outline' : 'default'
  const isExternal = /^(https?:|mailto:|tel:)/.test(href)

  if (isExternal) {
    return (
      <Button
        className={cn(className)}
        nativeButton={false}
        render={
          <a
            href={href}
            {...newTabProps}
          >
            {label}
          </a>
        }
        size={size}
        variant={variant}
      />
    )
  }

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button
      className={cn(className)}
      nativeButton={false}
      render={<Link href={href} />}
      size={size}
      variant={variant}
    >
      {label}
    </Button>
  )
}
