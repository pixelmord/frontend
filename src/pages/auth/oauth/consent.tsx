import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { FrontendClientBase } from '@/components/frontend-client-base'
import { renderedPageNoHooks } from '@/helper/rendered-page'

export default renderedPageNoHooks(() => (
  <FrontendClientBase>
    <Consent />
  </FrontendClientBase>
))

function Consent() {
  const router = useRouter()
  const { consent_challenge } = router.query
  useEffect(() => {
    if (!router.isReady || !consent_challenge) {
      return
    }

    // Skip consent because OAuth is only used internally at the moment
    void router.push(
      `/api/oauth/accept-consent?consent_challenge=${String(consent_challenge)}`
    )
    return
  }, [router, router.isReady, consent_challenge])

  return null
}