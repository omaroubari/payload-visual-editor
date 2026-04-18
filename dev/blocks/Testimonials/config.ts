import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
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
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'stars',
          type: 'select',
          defaultValue: '5',
          options: ['1', '2', '3', '4', '5'],
          required: true,
        },
        {
          name: 'avatarUrl',
          type: 'text',
        },
      ],
      minRows: 1,
      required: true,
    },
  ],
}
