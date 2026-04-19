import type { Page } from '@/payload-types.js'

import { ContentBlock } from './ContentBlock.js'
import { CTABlock } from './CTABlock.js'
import { FAQsBlock } from './FAQsBlock.js'
import { FeaturesBlock } from './FeaturesBlock.js'
import { MediaBlock } from './MediaBlock.js'
import { TestimonialsBlock } from './TestimonialsBlock.js'

type RenderBlocksProps = {
  blocks?: Page['layout'][0][]
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
              {...block}
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
            key={block.id}
              {...block}
            />
          )
        }

        if (block.blockType === 'features') {
          return (
            <FeaturesBlock
            key={block.id}
              {...block}
            />
          )
        }

        if (block.blockType === 'faqs') {
          return (
            <FAQsBlock
              {...block}
            items={block.items?.map((item) => ({
                answer: item.answer,
                question: item.question,
              }))}
              key={block.id}
            />
          )
        }

        if (block.blockType === 'testimonials') {
          return (
            <TestimonialsBlock
              {...block}
              items={block.items?.map((item) => ({
                name: item.name,
                avatarUrl: item.avatarUrl,
                content: item.content,
                role: item.role,
                stars: item.stars,
              }))}
              key={block.id ?? index}
            />
          )
        }

        if (block.blockType === 'mediaBlock') {
          return <MediaBlock key={block.id}
            {...block} />
        }

        return null
      })}
    </div>
  )
}
