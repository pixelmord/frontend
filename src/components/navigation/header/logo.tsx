import clsx from 'clsx'

import { Link } from '@/components/content/link'

const logoTargetWidth = 160

interface LogoProps {
  subline: string
  noLink?: boolean
}

export function Logo({ subline, noLink }: LogoProps) {
  return (
    <>
      <div>
        <Link href={noLink ? undefined : '/'} path={['logo']}>
          <img
            className="inline"
            alt="Serlo"
            src="/_assets/img/serlo-logo.svg"
            width={logoTargetWidth}
            height="80"
          />
        </Link>
      </div>
      {subline && (
        <div className="pl-12 pt-2 ml-0.5 print:hidden">
          <Link
            href={noLink ? undefined : '/'}
            path={['logo']}
            className={clsx(
              'text-truegray-500 font-medium text-2xl hover:no-underline hover:text-brand',
              'sm:text-2.5xl sm:tracking-slightly-tighter leading-normal'
            )}
          >
            {subline}
          </Link>
        </div>
      )}
    </>
  )
}
