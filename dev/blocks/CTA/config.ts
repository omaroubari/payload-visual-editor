import type { Block } from 'payload'

export const CTA: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'text',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      type: 'text',
    },
    {
      name: 'buttonUrl',
      type: 'text',
    },
  ],
}
