import type { Block } from 'payload'

export const Media: Block = {
  slug: 'media',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
