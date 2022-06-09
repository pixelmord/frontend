import clsx from 'clsx'
import { Router } from 'next/router'
import { useState } from 'react'

import { Link } from '../content/link'
import { MobileMenu } from '../navigation/mobile-menu'
import { Menu } from './menu'
import { MobileMenuButton } from './mobile-menu-button'
import { useAuthentication } from '@/auth/use-authentication'
import { Quickbar } from '@/components/navigation/quickbar'
import { useInstanceData } from '@/contexts/instance-context'

export function Header() {
  const [isOpen, setOpen] = useState(false)
  const auth = useAuthentication()
  const { strings, headerData } = useInstanceData()

  // compat: close mobile menu on client side navigation, we need the global Router instance
  Router.events.on('routeChangeStart', () => {
    setOpen(false)
  })

  return (
    <>
      <header className="text-truegray-700 mt-2 pb-5 mb-5">
        <div className="pt-3 pb-6 px-side lg:px-side-lg">
          <div className="mobile:flex mobile:justify-between md:flex-wrap lg:flex-nowrap">
            <MobileMenuButton onClick={() => setOpen(!isOpen)} open={isOpen} />
            <Link href="/" path={['logo']} className="w-min sm:w-auto">
              <img
                className="inline"
                alt="Serlo"
                src="/_assets/img/serlo-logo.svg"
                width="120"
                height="80"
              />
              <span
                className={clsx(
                  'font-handwritten text-xl align-text-top text-truegray-700',
                  'ml-9 mt-2 block mobile:inline-block mobile:ml-9 sm:mt-4 mobile:whitespace-nowrap',
                  'sm:ml-2'
                )}
              >
                Die freie Lernplattform
              </span>
            </Link>
            <div className="lg:order-last">
              <Menu data={headerData} auth={auth.current} />
            </div>
            <div className="hidden md:block lg:hidden basis-full h-0" />
            <Quickbar
              className={clsx(
                'mt-7 mx-auto text-left font-normal',
                'mobile:max-w-sm mobile:ml-4 mobile:mr-0',
                'mobile:mt-5 mobile:px-2 mobile:flex-grow', //mobile:flex-grow mobile:px-8
                'md:mt-0 md:max-w-xs',
                'lg:mt-6 lg:max-w-sm'
              )}
              placeholder={strings.header.search}
            />
          </div>
        </div>
        {isOpen && <MobileMenu data={headerData} auth={auth.current} />}
      </header>
    </>
  )
}
