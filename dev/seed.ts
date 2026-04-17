import type { Payload } from 'payload'

import { devUser } from './helpers/credentials.js'

export const seed = async (payload: Payload) => {
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  if (!totalDocs) {
    await payload.create({
      collection: 'users',
      data: devUser,
    })
  }

  const pagesCount = await payload.count({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  if (!pagesCount.totalDocs) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout: [
          {
            blockType: 'content',
            heading: 'Minimal Page Builder',
            content:
              'This page is rendered from the new pages collection using a blocks field and a simple block renderer.',
          },
          {
            blockType: 'cta',
            heading: 'Start building pages',
            text: 'Mix and match simple blocks to quickly shape a landing page in the admin.',
            buttonLabel: 'Open admin',
            buttonUrl: '/admin',
          },
          {
            blockType: 'media',
            caption: 'Add an image in this block from the media library to replace this placeholder.',
          },
        ],
      },
    })
  }
}
