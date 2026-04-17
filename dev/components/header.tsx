'use client'
import { Logo, LogoIcon } from 'dev/components/logo'
import { Button } from 'dev/components/ui/button'
import { cn } from 'dev/lib/utils'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const menuItems = [
  { name: 'Features', href: '#link' },
  { name: 'Pricing', href: '#link' },
  { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <header>
      <nav
        className={cn(
          'fixed z-20 w-full transition-all duration-300',
          isScrolled && 'bg-background/75 border-b border-black/5 backdrop-blur-lg',
        )}
        data-state={menuState && 'active'}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div
            className={cn(
              'relative flex flex-wrap items-center justify-between gap-6 py-6 transition-all duration-200 lg:gap-0',
              isScrolled && 'py-3',
            )}
          >
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              <Link aria-label="home" className="flex items-center space-x-2" href="/">
                <LogoIcon />
              </Link>

              <button
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                onClick={() => setMenuState(!menuState)}
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="m-auto hidden size-fit lg:block">
                <ul className="flex gap-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Button
                        nativeButton={false}
                        render={<Link className="text-base" href={item.href} />}
                        size="sm"
                        variant="ghost"
                      >
                        <span>{item.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        href={item.href}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  className={cn(isScrolled && 'lg:hidden')}
                  nativeButton={false}
                  render={<Link href="#" />}
                  size="sm"
                  variant="ghost"
                >
                  <span>Login</span>
                </Button>
                <Button
                  className={cn(isScrolled && 'lg:hidden')}
                  nativeButton={false}
                  render={<Link href="#" />}
                  size="sm"
                >
                  <span>Sign Up</span>
                </Button>
                <Button
                  className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                  nativeButton={false}
                  render={<Link href="#" />}
                  size="sm"
                >
                  <span>Get Started</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
