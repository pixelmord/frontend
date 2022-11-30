import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import type { TippyProps } from '@tippyjs/react'
import clsx from 'clsx'
import { useState, useEffect } from 'react'

import { Link } from '../content/link'
import { LenabiLogInLink } from '../lenabi/lenabi-log-in-link'
import { getAvatarUrl } from '../user/user-link'
import { AuthenticationPayload } from '@/auth/auth-provider'
import { FaIcon } from '@/components/fa-icon'
import { MenuSubButtonLink } from '@/components/user-tools/menu-sub-button-link'
import { useInstanceData } from '@/contexts/instance-context'
import { useLoggedInComponents } from '@/contexts/logged-in-components'
import { useLoggedInData } from '@/contexts/logged-in-data-context'
import { HeaderData, HeaderLink } from '@/data-types'
import { getAuthData } from '@/helper/feature-auth'
import { submitEvent } from '@/helper/submit-event'
import { triggerSentry } from '@/helper/trigger-sentry'

// Only show some icons on full menu
const menuIconMapping = {
  subject: undefined,
  about: undefined,
  participate: undefined,
  community: undefined,
  donate: undefined,
  login: undefined,
  user: faUser,
  notifications: faBell,
}

export interface MenuProps {
  data: HeaderData
  auth: AuthenticationPayload
}

export function Menu(props: MenuProps) {
  const [Tippy, setTippy] = useState<typeof import('@tippyjs/react') | null>(
    null
  )
  useEffect(() => {
    void import('@tippyjs/react').then(
      (value) => setTippy(value),
      (reason) => {
        // eslint-disable-next-line no-console
        console.error(reason)
        triggerSentry({ message: 'tippy chunk load problem: ' })
      }
    )
  }, [])

  if (!Tippy) {
    return <MenuWithoutTippy {...props} />
  }
  return <MenuWithTippy {...props} Tippy={Tippy} />
}

function MenuWithoutTippy(props: MenuProps) {
  return <MenuInner {...props} />
}

function MenuWithTippy(
  props: MenuProps & { Tippy: typeof import('@tippyjs/react') }
) {
  const [source, target] = props.Tippy.useSingleton()
  return <MenuInner {...props} source={source} target={target} />
}

function MenuInner({
  data,
  auth,
  Tippy,
  source,
  target,
}: MenuProps & {
  Tippy?: typeof import('@tippyjs/react')
  source?: TippyProps['singleton']
  target?: TippyProps['singleton']
}) {
  //
  const [mounted, setMounted] = useState(true)
  const { strings } = useInstanceData()
  const loggedInData = useLoggedInData()

  type TippyRoot = Parameters<NonNullable<TippyProps['onCreate']>>[0]
  const [tippyRoot, setTippyRoot] = useState<TippyRoot | null>(null)

  useEffect(() => setMounted(true), [])

  const loggedInComponents = useLoggedInComponents()

  function onSubMenuInnerClick() {
    if (tippyRoot && tippyRoot !== undefined) tippyRoot.hide()
  }

  return (
    <nav className="min-h-[50px] hidden md:block mt-[1.7rem] md:mt-7">
      {Tippy && (
        <Tippy.default
          singleton={source}
          placement="bottom-start"
          trigger="click mouseenter focus"
          hideOnClick
          interactive
          delay={[50, 0]}
          duration={[300, 100]}
          animation="fade"
          onCreate={(tip) => {
            setTippyRoot(tip)
          }}
        />
      )}
      <ul className="text-right block m-0 p-0">
        {data.map((link, i) => renderEntry({ link }, i))}
        {renderAuthMenu()}
      </ul>
    </nav>
  )

  function renderAuthMenu() {
    const data = getAuthData(
      mounted && auth !== null,
      strings.header.login,
      loggedInData?.authMenu
    )

    // render placeholder while data is loading
    if (typeof window !== 'undefined' && window.location.pathname === '/')
      return renderEntry(
        {
          link: {
            url: '/api/auth/login',
            title: 'Anmelden',
            icon: 'login',
          },
          authMenuMounted: false,
        },
        'auth'
      )

    return data
      ? data.map((link) => {
          return renderEntry(
            {
              link: link,
              authMenuMounted: mounted,
            },
            'auth'
          )
        })
      : null
  }

  interface EntryData {
    link: HeaderLink
    authMenuMounted?: boolean
  }

  function renderEntry({ link }: EntryData, i: number | string) {
    const hasChildren = link.children !== undefined
    const hasIcon =
      link.icon &&
      link.icon !== undefined &&
      menuIconMapping[link.icon] !== undefined

    const styledLinkCls = /* className={ */ clsx(
      'serlo-button-blue-transparent',
      'text-[0.9rem] leading-tight block transition mx-[3px] my-0 text-brand-light',
      hasIcon ? '-mt-[5px] p-[7px]' : 'mt-[11px] py-0.5 px-[7px]',
      'serlo-menu-entry-special'
    )

    return (
      <li
        className={clsx(
          'inline-block',
          'opacity-100',
          'ease-linear duration-700'
        )}
        key={link.title}
        onClick={() => {
          if (link.url === '/spenden') submitEvent('spenden-header-menu-click')
        }}
      >
        {hasChildren ? (
          Tippy ? (
            <Tippy.default
              content={renderSubMenuInner(link.children, i)}
              singleton={target}
            >
              <Link tabIndex={0} className={styledLinkCls}>
                {renderIcon()}
                {!hasIcon && link.title} <FaIcon icon={faCaretDown} />
              </Link>
            </Tippy.default>
          ) : (
            <Link tabIndex={0} className={styledLinkCls}>
              {renderIcon()}
              {!hasIcon && link.title} <FaIcon icon={faCaretDown} />
            </Link>
          )
        ) : link.url.includes('/api/auth/login') ? (
          <LenabiLogInLink title={link.title} />
        ) : (
          <Link
            href={link.url}
            path={['menu', i]}
            className={clsx('group', styledLinkCls)}
          >
            {renderIcon()} {!hasIcon && link.title}
            <span className="sr-only">{strings.pageTitles.notifications}</span>
          </Link>
        )}
      </li>
    )

    function renderIcon() {
      if (!hasIcon) return null

      if (link.icon === 'notifications') {
        const Comp = loggedInComponents?.UnreadNotificationsCount
        if (Comp) return <Comp icon={menuIconMapping[link.icon]} />
      }

      if (link.icon === 'user' && auth && auth.username) {
        return (
          <img
            className="rounded-full w-10 h-10 inline -mt-1"
            src={getAvatarUrl(auth.username)}
            title={`${link.title} ${auth.username}`}
          />
        )
      }

      // only notification and user are in use and handled above
      return null
    }
  }

  function renderSubMenuInner(subEntries?: HeaderLink[], i?: number | string) {
    return (
      <ul className="serlo-sub-list">
        {subEntries !== undefined &&
          subEntries.map((entry, i2) => {
            const href = auth
              ? entry.url.replace(
                  '/user/me',
                  `/user/${auth.id}/${auth.username}`
                )
              : entry.url

            return (
              <li key={entry.title} onClick={onSubMenuInnerClick}>
                <MenuSubButtonLink href={href} path={['menu', i!, i2]}>
                  {entry.title}
                </MenuSubButtonLink>
              </li>
            )
          })}
      </ul>
    )
  }
}
