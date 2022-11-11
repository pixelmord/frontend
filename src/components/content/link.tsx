import clsx from 'clsx'
import { default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import { ForwardedRef, forwardRef, ReactNode } from 'react'

import { ExternalLink } from './external-link'
import { useInstanceData } from '@/contexts/instance-context'
import { NodePath } from '@/schema/article-renderer'

export interface LinkProps {
  href?: string
  children: ReactNode
  className?: string
  noExternalIcon?: boolean
  title?: string
  forceNoCSR?: boolean
  path?: NodePath
  unreviewed?: boolean // e.g. user profiles or comments
  tabIndex?: number // menu
  unstyled?: boolean // don't add serlo-link class
}

// note: Previous discussion about fetching this dynamically https://github.com/serlo/frontend/issues/328
const legacyLinks = [
  '/privacy',
  '/datenschutz',
  '/imprint',
  '/terms',
  '/disable-frontend',
  '/enable-frontend',
  '/beitreten',
  '/user/register',
]

export function isLegacyLink(_href: string) {
  // compat: this is a special frontend route or force frontend use
  if (
    _href == '/user/notifications' ||
    _href == '/user/settings' ||
    _href == '/entity/unrevised' ||
    _href == '/uuid/recycle-bin' ||
    _href == '/pages' ||
    _href == '/authorization/roles' ||
    _href.startsWith('/taxonomy/term/update/')
  ) {
    return false
  }

  return (
    legacyLinks.includes(_href) ||
    _href.startsWith('/auth/') ||
    _href.startsWith('/api/auth') ||
    _href.startsWith('/authorization') ||
    _href.startsWith('/navigation') ||
    _href.startsWith('/entity/repository/add-revision-old/') || // temporary
    _href.includes('.serlo.org') // e.g. community.serlo.org or different language
  )
}

// warning: forwarding ref is crucial for dropdowns to work
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return InternalLink({
    ...props,
    ref,
  })
})

Link.displayName = 'Link'

// don't use this outside this component
function InternalLink({
  href,
  children,
  className,
  noExternalIcon,
  title,
  forceNoCSR,
  unreviewed,
  tabIndex,
  unstyled,
  ref,
}: LinkProps & { ref?: ForwardedRef<HTMLAnchorElement> }) {
  const { lang } = useInstanceData()
  const router = useRouter()

  if (!href || href === undefined || href === '')
    return (
      <a className={className} title={title} tabIndex={tabIndex} ref={ref}>
        {children}
      </a>
    )

  const isAbsolute = href.indexOf('//') > -1
  const isExternal = isAbsolute && !href.includes('.serlo.org')
  const isAnchor = href.startsWith('#') || href.startsWith('/#')
  const isMailto = href.startsWith('mailto:')
  const isContentOnly = router.asPath.startsWith('/content-only/')

  if (isAnchor || isMailto) return renderLink(href)
  if (isExternal || forceNoCSR || isContentOnly) return renderLink(href)

  //at this point only internal links should be left

  const internalLink = normalizeSerloLink(href)

  if (!isLegacyLink(internalLink)) return renderClientSide(internalLink)

  //fallback
  return renderLink(href)

  function normalizeSerloLink(_href: string) {
    // compat: some user are typing \1234 instead of /1234
    if (/^\\[\d]+$/.test(_href)) {
      return _href.replace('\\', '/')
    }

    return _href.startsWith(`https://${lang}.serlo.org/`)
      ? _href.replace(`https://${lang}.serlo.org`, '')
      : _href.startsWith('/')
      ? _href
      : '/' + _href
  }

  function renderClientSide(_href: string) {
    return (
      <NextLink prefetch={false} href={_href}>
        {renderLink(_href)}
      </NextLink>
    )
  }

  function renderLink(_href: string) {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        href={_href}
        className={unstyled ? className : clsx(className, 'serlo-link')}
        title={title}
        rel={unreviewed && isExternal ? 'ugc nofollow noreferrer' : undefined}
        target={
          (unreviewed && isExternal) || isContentOnly ? '_blank' : undefined
        }
        tabIndex={tabIndex}
        ref={ref}
      >
        {children}
        {isExternal && !noExternalIcon && <ExternalLink />}
      </a>
    )
  }
}
