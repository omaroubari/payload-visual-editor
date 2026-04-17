import { CTABlock } from './CTABlock.js'
import { ContentBlock } from './ContentBlock.js'
import { MediaBlock } from './MediaBlock.js'

type Block = {
  id?: string
  blockType?: string
  heading?: string | null
  content?: string | null
  text?: string | null
  buttonLabel?: string | null
  buttonUrl?: string | null
  image?:
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {blocks.map((block, index) => {
        if (block.blockType === 'content') {
          return <ContentBlock key={block.id ?? index} content={block.content} heading={block.heading} />
        }

        if (block.blockType === 'cta') {
          return (
            <CTABlock
              key={block.id ?? index}
              buttonLabel={block.buttonLabel}
              buttonUrl={block.buttonUrl}
              heading={block.heading}
              text={block.text}
            />
          )
        }

        if (block.blockType === 'media') {
          return <MediaBlock key={block.id ?? index} caption={block.caption} image={block.image} />
        }

        return null
      })}
    </div>
  )
}
