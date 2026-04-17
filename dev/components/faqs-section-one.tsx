'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'dev/components/ui/accordion'
import Link from 'next/link'

export default function FAQs() {
  const faqItems = [
    {
      id: 'item-1',
      answer:
        'Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.',
      question: 'How long does shipping take?',
    },
    {
      id: 'item-2',
      answer:
        'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For enterprise customers, we also offer invoicing options.',
      question: 'What payment methods do you accept?',
    },
    {
      id: 'item-3',
      answer:
        'You can modify or cancel your order within 1 hour of placing it. After this window, please contact our customer support team who will assist you with any changes.',
      question: 'Can I change or cancel my order?',
    },
    {
      id: 'item-4',
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Additional customs fees may apply depending on your country's import regulations.",
      question: 'Do you ship internationally?',
    },
    {
      id: 'item-5',
      answer:
        'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some specialty items may have different return terms, which will be noted on the product page.',
      question: 'What is your return policy?',
    },
  ]

  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div>
          <h2 className="text-foreground text-4xl font-semibold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-4 text-balance text-lg">
            Discover quick and comprehensive answers to common questions about our platform,
            services, and features.
          </p>
        </div>

        <div className="mt-12">
          <Accordion className="bg-card ring-foreground/5 rounded-(--radius) w-full border border-transparent px-8 py-3 shadow ring-1">
            {faqItems.map((item) => (
              <AccordionItem className="border-dotted" key={item.id} value={item.id}>
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6">
            Can't find what you're looking for? Contact our{' '}
            <Link className="text-primary font-medium hover:underline" href="#">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
