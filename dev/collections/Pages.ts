import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { CTA } from '../blocks/CTA/config.js'
import { Content } from '../blocks/Content/config.js'
import { Media } from '../blocks/Media/config.js'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Content, CTA, Media],
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
    slugField(),
  ],
}
