import { useRouter } from 'next/router'

import { fetchAndPersistAuthSession } from '@/auth/fetch-auth-session'
import { kratos } from '@/auth/kratos'
import { useInstanceData } from '@/contexts/instance-context'
import { showToastNotice } from '@/helper/show-toast-notice'

export function useLogout() {
  const router = useRouter()
  const { strings } = useInstanceData()
  const oauth = undefined
  const { logout_challenge } = router.query

  return () => {
    fetchAndPersistAuthSession().catch(() => {
      return router.push('/')
    })

    const originalPreviousPath = sessionStorage.getItem('previousPathname')

    kratos
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        kratos
          .submitSelfServiceLogoutFlow(data.logout_token)
          .then(async () => {
            void fetchAndPersistAuthSession(null)

            if (oauth) {
              if (!logout_challenge) return
              return await router.push(
                `/api/oauth/accept-logout?logout_challenge=${String(
                  logout_challenge
                )}`
              )
            }
            showToastNotice(strings.notices.bye)

            setTimeout(() => {
              // TODO: make sure router.push() also rerenders authed components (e.g. header)
              window.location.href = originalPreviousPath ?? '/'
            }, 1000)

            return
          })
          .catch((error: unknown) => {
            return Promise.reject(error)
          })
      })
      .catch((error: unknown) => {
        return Promise.reject(error)
      })
  }
}