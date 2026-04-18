import type { CMSLinkData } from 'dev/components/blocks/CMSButtonLink.js'

type MediaValue =
  | {
      url?: null | string
    }
  | null
  | string

export type HeroData = {
  announcement?: null | string
  heading?: null | string
  links?: Array<{
    id?: null | string
    link?: CMSLinkData | null
  }> | null
  media?: MediaValue
  subheading?: null | string
  type?: 'highImpact' | 'none' | null
}
