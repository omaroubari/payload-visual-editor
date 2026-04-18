import { Button } from 'dev/components/ui/button'
import { cn } from 'dev/lib/utils'
import Link from 'next/link'

type ReferenceValue = {
  slug?: null | string
}

type Reference =
  | {
      relationTo?: 'pages' | 'posts'
      value?: null | number | ReferenceValue
    }
  | null
  | number

export type CMSLinkData = {
  appearance?: 'default' | 'outline' | null
  label?: null | string
  newTab?: boolean | null
  reference?: Reference
  type?: 'custom' | 'reference' | null
  url?: null | string
}

const getHref = (link?: CMSLinkData | null) => {
  if (!link) {
    return null
  }

  if (link.type === 'custom') {
    return link.url ?? null
  }

  const reference = link.reference

  if (!reference || typeof reference === 'number' || !('value' in reference)) {
    return null
  }

  const value = reference.value

  if (!value || typeof value === 'number' || typeof value.slug !== 'string') {
    return null
  }

  return value.slug === 'home' ? '/' : `/${value.slug}`
}

type Props = {
  className?: string
  link?: CMSLinkData | null
  size?: 'default' | 'lg' | 'sm'
}

export const CMSButtonLink = ({ className, link, size = 'lg' }: Props) => {
  const href = getHref(link)
  const label = link?.label?.trim()

  if (!href || !label) {
    return null
  }

  const variant = link?.appearance === 'outline' ? 'outline' : 'default'
  const isExternal = /^(https?:|mailto:|tel:)/.test(href)

  if (isExternal) {
    return (
      <Button
        className={cn(className)}
        nativeButton={false}
        render={
          <a
            href={href}
            rel={link?.newTab ? 'noopener noreferrer' : undefined}
            target={link?.newTab ? '_blank' : undefined}
          >
            {label}
          </a>
        }
        size={size}
        variant={variant}
      />
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

export const CMSInlineLink = ({
  className,
  link,
}: {
  className?: string
  link?: CMSLinkData | null
}) => {
  const href = getHref(link)
  const label = link?.label?.trim()

  if (!href || !label) {
    return null
  }

  const isExternal = /^(https?:|mailto:|tel:)/.test(href)

  if (isExternal) {
    return (
      <a
        className={className}
        href={href}
        rel={link?.newTab ? 'noopener noreferrer' : undefined}
        target={link?.newTab ? '_blank' : undefined}
      >
        {label}
      </a>
    )
  }

  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  )
}
