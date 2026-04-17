import { Button } from 'dev/components/ui/button'
import Link from 'next/link'

export default function StatsSection() {
  return (
    <section>
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-6 text-center">
            <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">
              Build 10x Faster with Mist
            </h2>
            <div className="flex justify-center gap-3">
              <Button nativeButton={false} render={<Link href="#" />} size="lg">
                Get Started
              </Button>
              <Button nativeButton={false} render={<Link href="#" />} size="lg" variant="outline">
                Get a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
