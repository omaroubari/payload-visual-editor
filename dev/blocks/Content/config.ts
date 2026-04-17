import type { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],
}
