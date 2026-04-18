import type { Block } from 'payload'

import { link } from '@/fields/link'

export const FAQs: Block = {
  slug: 'faqs',
  interfaceName: 'FAQsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
      minRows: 1,
      required: true,
    },
    {
      name: 'supportText',
      type: 'text',
    },
    link({
      overrides: {
        name: 'supportLink',
      },
    }),
  ],
}
