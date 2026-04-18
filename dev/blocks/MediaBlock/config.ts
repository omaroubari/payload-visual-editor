import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaSectionBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
