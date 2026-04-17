import { CTABlock } from './CTABlock.js'
import { ContentBlock } from './ContentBlock.js'
import { HeroBlock } from './HeroBlock.js'
import { MediaBlock } from './MediaBlock.js'

type Block = {
  id?: string
  blockType?: string
  type?: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | null
  heading?: string | null
  subheading?: string | null
  content?: string | null
  text?: string | null
  buttonLabel?: string | null
  buttonUrl?: string | null
  primaryButtonLabel?: string | null
  primaryButtonUrl?: string | null
  secondaryButtonLabel?: string | null
  secondaryButtonUrl?: string | null
  image?:
    | string
    | {
        url?: string | null
      }
    | null
  media?:
    | string
    | {
        url?: string | null
      }
    | null
  caption?: string | null
}

type RenderBlocksProps = {
  blocks?: Block[] | null
}

export const RenderBlocks = ({ blocks }: RenderBlocksProps) => {
  if (!blocks?.length) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-6 py-8">
      {blocks.map((block, index) => {
        if (block.blockType === 'hero') {
          return (
            <HeroBlock
              key={block.id ?? index}
              heading={block.heading}
              media={block.media}
              primaryButtonLabel={block.primaryButtonLabel}
              primaryButtonUrl={block.primaryButtonUrl}
              secondaryButtonLabel={block.secondaryButtonLabel}
              secondaryButtonUrl={block.secondaryButtonUrl}
              subheading={block.subheading}
              type={block.type}
            />
          )
        }

        if (block.blockType === 'content') {
          return (
            <div key={block.id ?? index} className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
              <ContentBlock content={block.content} heading={block.heading} />
            </div>
          )
        }

        if (block.blockType === 'cta') {
          return (
            <div key={block.id ?? index} className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
              <CTABlock
                buttonLabel={block.buttonLabel}
                buttonUrl={block.buttonUrl}
                heading={block.heading}
                text={block.text}
              />
            </div>
          )
        }

        if (block.blockType === 'media') {
          return (
            <div key={block.id ?? index} className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
              <MediaBlock caption={block.caption} image={block.image} />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
