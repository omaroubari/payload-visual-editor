import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'highImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
      ],
      required: true,
    },
    {
      name: 'announcement',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'highImpact',
        },
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'highImpact',
      },
      relationTo: 'media',
    },
  ],
  label: false,
}
