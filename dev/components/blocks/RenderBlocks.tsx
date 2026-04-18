import { CTABlock } from './CTABlock.js'
import { ContentBlock } from './ContentBlock.js'
import { FAQsBlock } from './FAQsBlock.js'
import { FeaturesBlock } from './FeaturesBlock.js'
import { MediaBlock } from './MediaBlock.js'
import { TestimonialsBlock } from './TestimonialsBlock.js'
import type { CMSLinkData } from './CMSButtonLink.js'

export type PageBlock = {
  id?: string
  blockType?: string
  description?: string | null
  eyebrow?: string | null
  features?: Array<{
    description?: string | null
    icon?: 'calendarCheck' | 'sparkles' | 'target' | null
    illustration?: 'assistant' | 'codeReview' | 'meeting' | null
    title?: string | null
  }> | null
  heading?: string | null
  items?: Array<{
    answer?: string | null
    avatarUrl?: string | null
    content?: string | null
    description?: string | null
    illustration?: 'code' | 'schedule' | null
    name?: string | null
    question?: string | null
    role?: string | null
    stars?: '1' | '2' | '3' | '4' | '5' | null
    title?: string | null
  }> | null
  links?: Array<{
    id?: string | null
    link?: CMSLinkData | null
  }> | null
  media?:
    | string
    | {
        url?: string | null
      }
    | null
  caption?: string | null
  supportLink?: CMSLinkData | null
  supportText?: string | null
}

type RenderBlocksProps = {
  blocks?: PageBlock[] | null
}

export const RenderBlocks = ({ blocks }: RenderBlocksProps) => {
  if (!blocks?.length) {
    return null
  }

  return (
    <div>
      {blocks.map((block, index) => {
        if (block.blockType === 'content') {
          return (
            <ContentBlock
              description={block.description}
              eyebrow={block.eyebrow}
              heading={block.heading}
              items={block.items?.map((item) => ({
                description: item.description,
                illustration: item.illustration,
                title: item.title,
              }))}
              key={block.id ?? index}
            />
          )
        }

        if (block.blockType === 'cta') {
          return (
            <CTABlock
              description={block.description}
              heading={block.heading}
              key={block.id ?? index}
              links={block.links}
            />
          )
        }

        if (block.blockType === 'features') {
          return (
            <FeaturesBlock
              description={block.description}
              features={block.features}
              heading={block.heading}
              key={block.id ?? index}
            />
          )
        }

        if (block.blockType === 'faqs') {
          return (
            <FAQsBlock
              description={block.description}
              heading={block.heading}
              items={block.items?.map((item) => ({
                answer: item.answer,
                question: item.question,
              }))}
              key={block.id ?? index}
              supportLink={block.supportLink}
              supportText={block.supportText}
            />
          )
        }

        if (block.blockType === 'testimonials') {
          return (
            <TestimonialsBlock
              description={block.description}
              heading={block.heading}
              items={block.items?.map((item) => ({
                avatarUrl: item.avatarUrl,
                content: item.content,
                name: item.name,
                role: item.role,
                stars: item.stars,
              }))}
              key={block.id ?? index}
            />
          )
        }

        if (block.blockType === 'mediaBlock') {
          return <MediaBlock caption={block.caption} key={block.id ?? index} media={block.media} />
        }

        return null
      })}
    </div>
  )
}
