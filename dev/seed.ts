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
    const homePageData = {
      slug: 'home',
      hero: {
        type: 'highImpact',
        announcement: 'Introducing Mist Agents',
        heading: 'Build 10x Faster with Mist',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Start Building',
              url: '#link',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'Watch Video',
              url: '#link',
            },
          },
        ],
        subheading: 'Craft. Build. Ship modern websites with AI support.',
      },
      layout: [
        {
          blockType: 'content',
          description:
            'Efficient content creation is our mission. With Mist, you can edit text, generate code snippets, format documents, create visualizations from data, and keep your workflow moving.',
          eyebrow: 'Smart Editor',
          heading: 'Ask Mist to Edit Anything',
          items: [
            {
              description:
                "We'll put together your schedule automatically so you can work on the highest priority items first.",
              illustration: 'code',
              title: 'Marketing Campaigns',
            },
            {
              description:
                "Ask the chat to create or update your events, summarize last week's calls, or prepare today's agenda.",
              illustration: 'schedule',
              title: 'AI Meeting Scheduler',
            },
          ],
        },
        {
          blockType: 'features',
          description:
            'Mix AI-powered building blocks to move from idea to shipped interface faster.',
          features: [
            {
              description:
                'Our advanced AI models transform natural language into production-ready code.',
              icon: 'target',
              illustration: 'meeting',
              title: 'AI Code Generation',
            },
            {
              description:
                'Mist reviews your code for bugs, regressions, and optimization opportunities.',
              icon: 'calendarCheck',
              illustration: 'codeReview',
              title: 'Intelligent Code Review',
            },
            {
              description:
                'A personalized assistant that understands your codebase and helps solve complex problems.',
              icon: 'sparkles',
              illustration: 'assistant',
              title: 'Contextual AI Assistant',
            },
          ],
          heading: 'Empowering developers with AI-driven solutions',
        },
        {
          blockType: 'testimonials',
          items: [
            {
              name: 'Meschac Irung',
              avatarUrl: 'https://avatars.githubusercontent.com/u/47919550?v=4',
              content:
                "Using Mist has been like unlocking a secret design superpower. It's the perfect fusion of simplicity.",
              role: 'Creator',
              stars: '5',
            },
            {
              name: 'Theo Balick',
              avatarUrl: 'https://avatars.githubusercontent.com/u/68236786?v=4',
              content:
                'Mist has transformed the way I develop web applications. The flexibility to customize every aspect is amazing.',
              role: 'Frontend Dev',
              stars: '4',
            },
            {
              name: 'Glodie Lukose',
              avatarUrl: 'https://avatars.githubusercontent.com/u/99137927?v=4',
              content:
                'The extensive collection of UI components has significantly accelerated my workflow.',
              role: 'Frontend Dev',
              stars: '5',
            },
          ],
        },
        {
          blockType: 'faqs',
          description:
            'Discover quick and comprehensive answers to common questions about our platform, services, and features.',
          heading: 'Frequently Asked Questions',
          items: [
            {
              answer:
                'Standard onboarding takes 3-5 business days depending on your stack and deployment targets.',
              question: 'How long does onboarding take?',
            },
            {
              answer:
                'We support major deployment targets, internal staging environments, and custom enterprise workflows.',
              question: 'What deployment environments do you support?',
            },
            {
              answer:
                'You can adjust or pause your rollout window at any time from the dashboard or through support.',
              question: 'Can I change or cancel a rollout?',
            },
          ],
          supportLink: {
            type: 'custom',
            appearance: 'default',
            label: 'support team',
            url: '#support',
          },
          supportText: "Can't find what you're looking for? Contact our",
        },
        {
          blockType: 'cta',
          description:
            'Mix and match sections in Payload to shape a polished landing page quickly.',
          heading: 'Build 10x Faster with Mist',
          links: [
            {
              link: {
                type: 'custom',
                appearance: 'default',
                label: 'Get Started',
                url: '/admin',
              },
            },
            {
              link: {
                type: 'custom',
                appearance: 'outline',
                label: 'Get a Demo',
                url: '#demo',
              },
            },
          ],
        },
        {
          blockType: 'mediaBlock',
          caption: 'Add an image in Payload to replace this placeholder media frame.',
        },
      ],
      title: 'Home',
    }

    await payload.create({
      collection: 'pages',
      data: homePageData as never,
    })
  }
}
