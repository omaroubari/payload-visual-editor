import type { Block } from 'payload'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
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
      name: 'features',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'target',
          options: [
            {
              label: 'Target',
              value: 'target',
            },
            {
              label: 'Calendar Check',
              value: 'calendarCheck',
            },
            {
              label: 'Sparkles',
              value: 'sparkles',
            },
          ],
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'illustration',
          type: 'select',
          defaultValue: 'meeting',
          options: [
            {
              label: 'Meeting',
              value: 'meeting',
            },
            {
              label: 'Code Review',
              value: 'codeReview',
            },
            {
              label: 'Assistant',
              value: 'assistant',
            },
          ],
          required: true,
        },
      ],
      maxRows: 6,
      minRows: 1,
      required: true,
    },
  ],
}
